import cv2
import numpy as np
from collections import deque
import os
import sys

class AirCanvas:
    """
    Processes a video file to overlay a virtual 'chalkboard' drawing based on the movement of a specific colored object.
    """

    def run(self, input_path: str, hsv_target: dict = None, gesture_threshold: int = 500, thickness: int = 5) -> dict:
        """
        Args:
            input_path: Path to source video.
            hsv_target: Dict with 'lower' and 'upper' HSV bounds (lists of 3 ints).
            gesture_threshold: Velocity threshold (px/sec) for clear gesture.
            thickness: Brush thickness.

        Returns:
            Dict containing output_path and metadata.
        """
        if not os.path.exists(input_path):
             raise FileNotFoundError(f"Input path not found: {input_path}")

        # Default target (Neon Green approx) if not provided
        if hsv_target is None:
             lower_bound = np.array([30, 100, 100])
             upper_bound = np.array([50, 255, 255])
        else:
             lower_bound = np.array(hsv_target['lower'])
             upper_bound = np.array(hsv_target['upper'])

        cap = cv2.VideoCapture(input_path)
        if not cap.isOpened():
             raise ValueError(f"Could not open video file: {input_path}")

        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        if fps <= 0: fps = 30.0

        # Output setup
        base_name = os.path.splitext(input_path)[0]
        output_path = f"{base_name}_aircanvas.mp4"

        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

        # Persistent Canvas Layer (Black background)
        canvas = np.zeros((height, width, 3), dtype=np.uint8)

        # State
        points_buffer = deque(maxlen=8) # Short buffer for smoothing
        gesture_buffer = deque(maxlen=16) # Buffer for velocity calculation

        draw_events = 0
        clear_events = 0

        prev_point = None
        is_drawing = False

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # 1. Color Masking
            hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
            mask = cv2.inRange(hsv, lower_bound, upper_bound)

            # Noise reduction
            mask = cv2.erode(mask, None, iterations=2)
            mask = cv2.dilate(mask, None, iterations=2)

            cnts, _ = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

            current_center = None

            if len(cnts) > 0:
                # Largest contour
                c = max(cnts, key=cv2.contourArea)
                ((_, _), radius) = cv2.minEnclosingCircle(c)

                # Filter small contours to avoid noise
                if radius > 10:
                    M = cv2.moments(c)
                    if M["m00"] > 0:
                        center = (int(M["m10"] / M["m00"]), int(M["m01"] / M["m00"]))

                        # 2. Centroid Smoothing
                        points_buffer.append(center)

                        # Average of points in buffer
                        avg_x = int(sum(p[0] for p in points_buffer) / len(points_buffer))
                        avg_y = int(sum(p[1] for p in points_buffer) / len(points_buffer))
                        current_center = (avg_x, avg_y)

            # 3. Gesture Control
            # Check for Right-to-Left swipe (X decreasing rapidly)
            # Use frame timestamp approximation
            frame_time = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000.0

            if current_center:
                gesture_buffer.append((current_center[0], frame_time))

                # We need enough points to calculate velocity
                if len(gesture_buffer) > 4:
                    # Look at a window of time (~0.2s or last N frames)
                    x_new, t_new = gesture_buffer[-1]
                    x_old, t_old = gesture_buffer[0]

                    if t_new > t_old:
                        velocity = (x_new - x_old) / (t_new - t_old) # px/sec

                        # Right to Left implies negative velocity
                        if velocity < -gesture_threshold:
                            # Trigger CLEAR
                            canvas[:] = 0 # Efficient clear
                            clear_events += 1
                            gesture_buffer.clear()
                            points_buffer.clear()
                            prev_point = None
                            current_center = None # Stop drawing for this frame
            else:
                # If we lost the object, clear gesture buffer partially or fully?
                # Usually fully to reset gesture detection
                gesture_buffer.clear()

            # 4. Drawing Logic
            if current_center:
                if not is_drawing:
                    draw_events += 1
                    is_drawing = True

                if prev_point:
                    # Draw on canvas
                    # Using a fixed color (Neon Green: 0, 255, 0)
                    cv2.line(canvas, prev_point, current_center, (0, 255, 0), thickness)

                prev_point = current_center
            else:
                prev_point = None
                points_buffer.clear()
                is_drawing = False

            # 5. Compositing
            # Efficient NumPy overlay
            # Identify pixels drawn on canvas
            # We can check sum of channels or just one channel if we know color
            # General way: any pixel not black
            canvas_mask = np.any(canvas > 0, axis=-1)

            # Apply canvas to frame where canvas is drawn
            frame[canvas_mask] = canvas[canvas_mask]

            out.write(frame)

        cap.release()
        out.release()

        return {
            "output_path": output_path,
            "metadata": {
                "draw_events": draw_events,
                "clear_events": clear_events
            }
        }
