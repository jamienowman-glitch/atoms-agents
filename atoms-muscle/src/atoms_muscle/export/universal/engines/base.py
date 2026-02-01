from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Optional
from atoms_muscle.export.universal.models import ExportJob, ExportResult

class ExportEngine(ABC):
    """
    Abstract Base Class for all format-specific export engines.
    """

    @abstractmethod
    def render(self, job: ExportJob) -> str:
        """
        Render the canvas state into the target format.
        Returns the absolute path to the local temporary file.
        The Service is responsible for uploading this file to S3.
        """
        pass

    def get_content_type(self) -> str:
        """
        Return the MIME type for this engine's output.
        """
        raise NotImplementedError
