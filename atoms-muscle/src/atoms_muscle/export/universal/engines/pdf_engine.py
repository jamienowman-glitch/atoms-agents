import tempfile
import uuid
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib import colors

from atoms_muscle.export.universal.engines.base import ExportEngine
from atoms_muscle.export.universal.models import ExportJob

class PdfEngine(ExportEngine):
    def get_content_type(self) -> str:
        return "application/pdf"

    def render(self, job: ExportJob) -> str:
        # 1. Parse Dimensions
        width = job.output_params.width or 1920
        height = job.output_params.height or 1080
        
        # 2. Setup PDF
        tmp_dir = Path(tempfile.gettempdir()) / "atoms_exports"
        tmp_dir.mkdir(exist_ok=True)
        filename = f"{job.job_id}.pdf"
        output_path = tmp_dir / filename
        
        c = canvas.Canvas(str(output_path), pagesize=(width, height))
        
        # 3. Parse Content (Multi-page support)
        # Check for pages/scenes
        pages = []
        if "pages" in job.canvas_state:
            pages = job.canvas_state["pages"]
        elif "scenes" in job.canvas_state:
            pages = job.canvas_state["scenes"]
        else:
            # Single page mode (root is the page)
            pages = [job.canvas_state]
            
        for page_idx, page in enumerate(pages):
            # Background
            if job.output_params.include_background:
                # Retrieve bg color from page props or fallback
                props = page.get("props", {})
                bg_hex = props.get("backgroundColor", "#ffffff")
                r, g, b, a = self._hex_to_rgb(bg_hex)
                c.setFillColorRGB(r, g, b)
                # Draw big rect for background
                c.rect(0, 0, width, height, fill=1, stroke=0)
            
            # Atoms
            atoms = page.get("atoms", [])
            if isinstance(atoms, dict):
                atoms = atoms.values()
                
            for atom in atoms:
                try:
                    # PDF uses bottom-left origin usually, but we can transform or just map standard top-left
                    # Let's assume standard top-left input, so y needs flipping if PDF is bottom-left
                    # ReportLab default is bottom-left origin (0,0 is bottom-left).
                    # Web/Canvas is top-left origin.
                    # We need to flip y: pdf_y = height - atom_y - atom_h
                    
                    ax = atom.get("x", 0)
                    ay = atom.get("y", 0)
                    aw = atom.get("w", atom.get("width", 100))
                    ah = atom.get("h", atom.get("height", 100))
                    
                    pdf_y = height - ay - ah
                    
                    # Props
                    props = atom.get("props", {})
                    color_hex = props.get("backgroundColor", "#cccccc")
                    
                    # Draw Rect
                    r, g, b, a = self._hex_to_rgb(color_hex)
                    c.setFillColorRGB(r, g, b, alpha=a) # alpha supported? reportlab usually requires specific handling for alpha, simple RGB for now
                    # Actually reportlab canvas supports setFillColor(colorObj) or setFillColorRGB
                    # Handling alpha in PDF is trickier, sticking to RGB for simplicity
                    
                    c.rect(ax, pdf_y, aw, ah, fill=1, stroke=0)
                    
                    # Basic Text stub
                    atype = atom.get("type", "unknown")
                    if atype == "text":
                        text_content = props.get("text", "")
                        if text_content:
                            c.setFillColorRGB(0, 0, 0)
                            c.drawString(ax, pdf_y + ah - 12, text_content[:50]) # Simple debug text
                    
                except Exception as e:
                    print(f"Failed to render atom {atom.get('id')} on page {page_idx}: {e}")
                    continue
            
            c.showPage()
            
        c.save()
        return str(output_path)

    def _hex_to_rgb(self, hex_color: str) -> tuple:
        """Simple hex to rgb float (0-1)"""
        hex_color = hex_color.lstrip('#')
        try:
            if len(hex_color) == 6:
                r, g, b = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
                return r/255.0, g/255.0, b/255.0, 1.0
            elif len(hex_color) == 8:
                 r, g, b, a = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4, 6))
                 return r/255.0, g/255.0, b/255.0, a/255.0
            else:
                 return 0.8, 0.8, 0.8, 1.0
        except:
             return 0.8, 0.8, 0.8, 1.0
