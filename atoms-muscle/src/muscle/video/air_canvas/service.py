import cv2
import numpy as np
from collections import deque
import os
import logging
from typing import Optional, Dict, List, TypedDict, Any

# Configure Logger
logger = logging.getLogger(__name__)
if not logger.hasHandlers():
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)

class HSVBounds(TypedDict):
    lower: List[int]
    upper: List[int]

class AirCanvasResult(TypedDict):
    output_path: str
    metadata: Dict[str, int]

class VideoProcessingError(Exception):
    """Custom exception for video processing failures."""
    pass

class AirCanvas:
    """
    Production-grade AirCanvas processor.
    Tracks a colored object to draw on video frames.
    """

    # Default: Bright Orange (Hue ~10-25)
    DEFAULT_HSV: HSVBounds = {
        "lower": [10, 150, 150],
        "upper": [25, 255, 255]
    }

    def run(self,
            input_path: str,
            hsv_target: Optional[Dict[str, List[int]]] = None,
            gesture_threshold: int = 500,
            thickness: int = 5) -> AirCanvasResult:
        """
        Processes the video to overlay drawings.

        Args:
            input_path: Path to the source mp4/avi file.
            hsv_target: Optional override for color tracking.
                        Format: {"lower": [h,s,v], "upper": [h,s,v]}
            gesture_threshold: X-axis velocity (px/s) to trigger clear.
            thickness: Brush thickness in pixels.

        Returns:
            Dictionary with output path and stats.

        Raises:
            FileNotFoundError: If input does not exist.
            VideoProcessingError: If opencv fails to read/write.
        """

        # 1. Validation
        if not os.path.exists(input_path):
            logger.error(f"Input file not found: {input_path}")
            raise FileNotFoundError(f"Input path not found: {input_path}")

        # 2. Config Setup
        target_color = hsv_target if hsv_target else self.DEFAULT_HSV
        try:
            lower_bound = np.array(target_color['lower'], dtype=np.uint8)
            upper_bound = np.array(target_color['upper'], dtype=np.uint8)
        except (KeyError, ValueError) as e:
            logger.error(f"Invalid HSV target format: {e}")
            raise ValueError("hsv_target must contain 'lower' and 'upper' lists of 3 integers.")

        logger.info(f"Starting AirCanvas on {input_path} (Target: {target_color})")

        # 3. Resource Management
        cap = cv2.VideoCapture(input_path)
        if not cap.isOpened():
            logger.error(f"Failed to open video source: {input_path}")
            raise VideoProcessingError(f"Could not open video file: {input_path}")

        try:
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            fps = cap.get(cv2.CAP_PROP_FPS)
            if fps <= 0:
                fps = 30.0
                logger.warning("FPS detection failed, defaulting to 30.0")

            base_name = os.path.splitext(input_path)[0]
            output_path = f"{base_name}_aircanvas.mp4"

            # 'mp4v' is widely supported for .mp4 containers
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
            if not out.isOpened():
                raise VideoProcessingError("Failed to initialize VideoWriter.")

            # 4. Processing Loop
            canvas = np.zeros((height, width, 3), dtype=np.uint8)
            points_buffer: deque = deque(maxlen=8)
            gesture_buffer: deque = deque(maxlen=16)

            draw_events = 0
            clear_events = 0

            prev_point = None
            is_drawing = False
            frame_count = 0

            while True:
                ret, frame = cap.read()
                if not ret:
                    break

                frame_count += 1

                # Logic: Color Masking
                hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
                mask = cv2.inRange(hsv, lower_bound, upper_bound)
                mask = cv2.erode(mask, None, iterations=2)
                mask = cv2.dilate(mask, None, iterations=2)

                cnts, _ = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                current_center = None

                if len(cnts) > 0:
                    c = max(cnts, key=cv2.contourArea)
                    ((_, _), radius) = cv2.minEnclosingCircle(c)

                    if radius > 10:
                        M = cv2.moments(c)
                        if M["m00"] > 0:
                            center = (int(M["m10"] / M["m00"]), int(M["m01"] / M["m00"]))
                            points_buffer.append(center)

                            # Smoothing
                            avg_x = int(sum(p[0] for p in points_buffer) / len(points_buffer))
                            avg_y = int(sum(p[1] for p in points_buffer) / len(points_buffer))
                            current_center = (avg_x, avg_y)

                # Logic: Gesture (Right-to-Left Swipe)
                frame_time = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000.0
                # Fallback if timestamp is 0 (some containers)
                if frame_time == 0.0:
                    frame_time = frame_count / fps

                if current_center:
                    gesture_buffer.append((current_center[0], frame_time))
                    if len(gesture_buffer) > 4:
                        x_new, t_new = gesture_buffer[-1]
                        x_old, t_old = gesture_buffer[0]

                        if t_new > t_old:
                            velocity = (x_new - x_old) / (t_new - t_old)
                            if velocity < -gesture_threshold:
                                logger.info(f"Gesture detected (Clear) at {frame_time:.2f}s. Velocity: {velocity:.0f}px/s")
                                canvas[:] = 0
                                clear_events += 1
                                gesture_buffer.clear()
                                points_buffer.clear()
                                prev_point = None
                                current_center = None
                else:
                    gesture_buffer.clear()

                # Logic: Drawing
                if current_center:
                    if not is_drawing:
                        draw_events += 1
                        is_drawing = True

                    if prev_point:
                        # Draw Neon Green line on canvas
                        cv2.line(canvas, prev_point, current_center, (0, 255, 0), thickness)
                    prev_point = current_center
                else:
                    prev_point = None
                    points_buffer.clear()
                    is_drawing = False

                # Logic: Compositing
                canvas_mask = np.any(canvas > 0, axis=-1)
                frame[canvas_mask] = canvas[canvas_mask]
                out.write(frame)

            out.release()
            logger.info(f"Processing complete. Output: {output_path}")

            return {
                "output_path": output_path,
                "metadata": {
                    "draw_events": draw_events,
                    "clear_events": clear_events
                }
            }

        except cv2.error as e:
            logger.exception("OpenCV internal error")
            raise VideoProcessingError(f"OpenCV Error: {e}")
        finally:
            cap.release()
