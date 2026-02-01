from typing import Type
from .base import ExportEngine
from .stubs import (
    JpegEngineStub, Mp4EngineStub,
    PptxEngineStub, XlsxEngineStub, DocxEngineStub, XmlEngineStub,
    TxtEngineStub, MdEngineStub, HtmlEngineStub, TsxEngineStub,
    CssEngineStub, JsonEngineStub, SvgEngineStub
)
from .png_engine import PngEngine
from .pdf_engine import PdfEngine

ENGINE_MAP = {
    "png": PngEngine,
    "pdf": PdfEngine,
    "jpg": JpegEngineStub, 
    "jpeg": JpegEngineStub,
    "mp4": Mp4EngineStub,
    "pptx": PptxEngineStub,
    "xlsx": XlsxEngineStub,
    "csv": XlsxEngineStub, # Assuming shared engine for now
    "docx": DocxEngineStub,
    "xml": XmlEngineStub,
    "txt": TxtEngineStub,
    "md": MdEngineStub,
    "html": HtmlEngineStub,
    "tsx": TsxEngineStub,
    "css": CssEngineStub,
    "json": JsonEngineStub,
    "svg": SvgEngineStub
}

def get_engine(format_ext: str) -> ExportEngine:
    """
    Factory function to get the appropriate engine for a format.
    """
    engine_cls = ENGINE_MAP.get(format_ext.lower())
    if not engine_cls:
        raise ValueError(f"Unsupported format: {format_ext}")
    return engine_cls()
