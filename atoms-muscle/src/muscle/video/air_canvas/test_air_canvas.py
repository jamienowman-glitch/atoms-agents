import unittest
from unittest.mock import MagicMock, patch
import numpy as np
import sys
import os

# Add src to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from muscle.video.air_canvas.service import AirCanvas

class TestAirCanvas(unittest.TestCase):
    @patch("muscle.video.air_canvas.service.cv2")
    def test_run_basic(self, mock_cv2):
        # Setup Mocks
        mock_cap = MagicMock()
        mock_cap.isOpened.return_value = True

        # Configure get() to handle static props and time
        def get_side_effect(prop):
            if prop == mock_cv2.CAP_PROP_FRAME_WIDTH: return 100.0
            if prop == mock_cv2.CAP_PROP_FRAME_HEIGHT: return 100.0
            if prop == mock_cv2.CAP_PROP_FPS: return 30.0
            if prop == mock_cv2.CAP_PROP_POS_MSEC: return 0.0
            return 0.0

        mock_cap.get.side_effect = get_side_effect

        # Frames setup: 3 frames
        frame1 = np.zeros((100, 100, 3), dtype=np.uint8)
        frame2 = np.zeros((100, 100, 3), dtype=np.uint8)

        mock_cap.read.side_effect = [(True, frame1), (True, frame2), (False, None)]
        mock_cv2.VideoCapture.return_value = mock_cap

        # Mock VideoWriter
        mock_out = MagicMock()
        mock_cv2.VideoWriter.return_value = mock_out

        # Mock Contour Logic
        mock_contour = MagicMock()
        # findContours returns (contours, hierarchy)
        mock_cv2.findContours.return_value = ([mock_contour], None)
        mock_cv2.contourArea.return_value = 100
        # minEnclosingCircle returns ((x,y), radius)
        mock_cv2.minEnclosingCircle.return_value = ((50, 50), 20) # Radius > 10

        # Moments
        # Frame 1: Center (50, 50) -> m10=5000, m00=100
        # Frame 2: Center (60, 50) -> m10=6000, m00=100
        m1 = {"m10": 5000, "m01": 5000, "m00": 100}
        m2 = {"m10": 6000, "m01": 5000, "m00": 100}

        mock_cv2.moments.side_effect = [m1, m2]

        # Mock inRange
        mock_cv2.inRange.return_value = np.zeros((100, 100), dtype=np.uint8)

        service = AirCanvas()
        with patch("os.path.exists", return_value=True):
            result = service.run("test.mp4")

        # We expect draw_events to increment
        # Frame 1: Center detected. Prev=None.
        # Frame 2: Center detected. Prev=Pt1. Draw line. draw_events++
        self.assertGreater(result['metadata']['draw_events'], 0)
        self.assertEqual(result['metadata']['clear_events'], 0)

        # Verify writing happened twice
        self.assertEqual(mock_out.write.call_count, 2)

    @patch("muscle.video.air_canvas.service.cv2")
    def test_gesture_clear(self, mock_cv2):
        # Test Right-to-Left swipe (X decreasing)
        mock_cap = MagicMock()
        mock_cap.isOpened.return_value = True

        # Timestamps for 6 frames: 0, 33, 66, 99, 132, 165 ms
        # We need a mutable list to pop from in side_effect
        timestamps = [0.0, 33.0, 66.0, 99.0, 132.0, 165.0, 198.0, 231.0]

        def get_side_effect(prop):
            if prop == mock_cv2.CAP_PROP_FRAME_WIDTH: return 100.0
            if prop == mock_cv2.CAP_PROP_FRAME_HEIGHT: return 100.0
            if prop == mock_cv2.CAP_PROP_FPS: return 30.0
            if prop == mock_cv2.CAP_PROP_POS_MSEC:
                if timestamps:
                    return timestamps.pop(0)
                return 0.0
            return 0.0

        mock_cap.get.side_effect = get_side_effect

        # 6 frames of movement + 1 end
        frames_count = 6
        mock_cap.read.side_effect = [(True, np.zeros((100, 100, 3), dtype=np.uint8))] * frames_count + [(False, None)]
        mock_cv2.VideoCapture.return_value = mock_cap

        mock_cv2.findContours.return_value = ([MagicMock()], None)
        mock_cv2.contourArea.return_value = 100
        mock_cv2.minEnclosingCircle.return_value = ((0, 0), 20)

        # Moments for X decreasing: 90 -> 10 rapidly
        # Smoothing (avg of last N) dampens velocity, so we need drastic change or lower threshold.
        # Let's make it drastic: 90 -> 50 -> 10
        xs = [90, 50, 10, 10, 10, 10]
        moments_list = []
        for x in xs:
            moments_list.append({"m10": x*100, "m01": 5000, "m00": 100})

        mock_cv2.moments.side_effect = moments_list
        mock_cv2.inRange.return_value = np.zeros((100, 100), dtype=np.uint8)

        service = AirCanvas()

        with patch("os.path.exists", return_value=True):
            # Threshold 200 to be safe with smoothing
            result = service.run("test.mp4", gesture_threshold=200)

        self.assertGreater(result['metadata']['clear_events'], 0)

if __name__ == "__main__":
    unittest.main()
