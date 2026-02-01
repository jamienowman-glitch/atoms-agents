from atoms_muscle.export.universal.engines.base import ExportEngine
from atoms_muscle.export.universal.models import ExportJob, ExportResult

class NotImplementedEngine(ExportEngine):
    def render(self, job: ExportJob) -> str:
        raise NotImplementedError(f"Engine for format {job.target_format} is not yet implemented.")

# class PngEngineStub(NotImplementedEngine): pass
# class PdfEngineStub(NotImplementedEngine): pass
class JpegEngineStub(NotImplementedEngine): pass
class Mp4EngineStub(NotImplementedEngine): pass
class PptxEngineStub(NotImplementedEngine): pass
class XlsxEngineStub(NotImplementedEngine): pass
class DocxEngineStub(NotImplementedEngine): pass
class XmlEngineStub(NotImplementedEngine): pass
class TxtEngineStub(NotImplementedEngine): pass
class MdEngineStub(NotImplementedEngine): pass
class HtmlEngineStub(NotImplementedEngine): pass
class TsxEngineStub(NotImplementedEngine): pass
class CssEngineStub(NotImplementedEngine): pass
class JsonEngineStub(NotImplementedEngine): pass
class SvgEngineStub(NotImplementedEngine): pass
