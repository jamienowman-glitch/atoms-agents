import unittest
from unittest.mock import MagicMock, patch
import numpy as np
import sys
import os

# Add src to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))

from muscle.video.air_canvas.service import AirCanvas, VideoProcessingError

class TestAirCanvas(unittest.TestCase):

    def setUp(self):
        # Common patches could go here, but strict isolation per test is safer with mocks
        pass

    @patch("muscle.video.air_canvas.service.cv2")
    def test_run_success(self, mock_cv2):
        """Test standard successful run."""
        # Fix: cv2.error must be an Exception class
        mock_cv2.error = Exception

        # Setup Mocks
        mock_cap = MagicMock()
        mock_cap.isOpened.return_value = True

        def get_side_effect(prop):
            if prop == mock_cv2.CAP_PROP_FRAME_WIDTH: return 100.0
            if prop == mock_cv2.CAP_PROP_FRAME_HEIGHT: return 100.0
            if prop == mock_cv2.CAP_PROP_FPS: return 30.0
            return 0.0

        mock_cap.get.side_effect = get_side_effect
        # Return one black frame then end
        mock_cap.read.side_effect = [(True, np.zeros((100, 100, 3), dtype=np.uint8)), (False, None)]
        mock_cv2.VideoCapture.return_value = mock_cap

        mock_out = MagicMock()
        mock_out.isOpened.return_value = True
        mock_cv2.VideoWriter.return_value = mock_out

        # Fix: findContours return value
        mock_cv2.findContours.return_value = ([], None)

        # Fix: inRange return value (mask)
        mock_cv2.inRange.return_value = np.zeros((100, 100), dtype=np.uint8)

        service = AirCanvas()
        with patch("os.path.exists", return_value=True):
            result = service.run("test.mp4")

        self.assertIn("output_path", result)
        self.assertEqual(result["metadata"]["draw_events"], 0) # No drawing in blank frames

    @patch("muscle.video.air_canvas.service.cv2")
    def test_invalid_input(self, mock_cv2):
        """Test file not found error."""
        service = AirCanvas()
        with self.assertRaises(FileNotFoundError):
            service.run("nonexistent.mp4")

    @patch("muscle.video.air_canvas.service.cv2")
    def test_video_open_failure(self, mock_cv2):
        """Test failure to open video capture."""
        mock_cv2.error = Exception
        mock_cap = MagicMock()
        mock_cap.isOpened.return_value = False
        mock_cv2.VideoCapture.return_value = mock_cap

        service = AirCanvas()
        with patch("os.path.exists", return_value=True):
            with self.assertRaises(VideoProcessingError):
                service.run("corrupt.mp4")

    @patch("muscle.video.air_canvas.service.cv2")
    def test_custom_config(self, mock_cv2):
        """Test passing custom HSV bounds."""
        mock_cv2.error = Exception
        mock_cap = MagicMock()
        mock_cap.isOpened.return_value = True

        # Fix: Ensure get returns float, not MagicMock
        mock_cap.get.return_value = 30.0

        mock_cap.read.side_effect = [(False, None)]
        mock_cv2.VideoCapture.return_value = mock_cap
        mock_out = MagicMock()
        mock_out.isOpened.return_value = True
        mock_cv2.VideoWriter.return_value = mock_out

        service = AirCanvas()
        custom_hsv = {"lower": [0,0,0], "upper": [255,255,255]}

        with patch("os.path.exists", return_value=True):
            service.run("test.mp4", hsv_target=custom_hsv)

        # Verify call made
        mock_cv2.VideoCapture.assert_called()

    @patch("muscle.video.air_canvas.service.cv2")
    def test_invalid_config(self, mock_cv2):
        """Test passing invalid HSV bounds."""
        service = AirCanvas()
        bad_hsv = {"wrong_key": []}

        with patch("os.path.exists", return_value=True):
            with self.assertRaises(ValueError):
                service.run("test.mp4", hsv_target=bad_hsv) # type: ignore

    @patch("muscle.video.air_canvas.service.cv2")
    def test_writer_failure(self, mock_cv2):
        """Test failure to initialize VideoWriter (e.g. permission/disk error)."""
        mock_cv2.error = Exception
        mock_cap = MagicMock()
        mock_cap.isOpened.return_value = True
        mock_cap.get.return_value = 30.0
        mock_cv2.VideoCapture.return_value = mock_cap

        # Mock Writer failing to open
        mock_out = MagicMock()
        mock_out.isOpened.return_value = False
        mock_cv2.VideoWriter.return_value = mock_out

        service = AirCanvas()
        with patch("os.path.exists", return_value=True):
            with self.assertRaisesRegex(VideoProcessingError, "Failed to initialize VideoWriter"):
                service.run("test.mp4")

if __name__ == "__main__":
    unittest.main()
