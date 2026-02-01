import tempfile
import uuid
from pathlib import Path
from PIL import Image, ImageDraw

from atoms_muscle.export.universal.engines.base import ExportEngine
from atoms_muscle.export.universal.models import ExportJob

class PngEngine(ExportEngine):
    def get_content_type(self) -> str:
        return "image/png"

    def render(self, job: ExportJob) -> str:
        # 1. Parse Dimensions
        # Default to 1920x1080 if not provided
        width = job.output_params.width or 1920
        height = job.output_params.height or 1080
        
        # 2. Setup Image
        # RGBA for transparency support
        if job.output_params.include_background:
            # Default white background if requested, or user defined color from canvas props if available
            # For now, simplistic white.
            bg_color = (255, 255, 255, 255)
        else:
            bg_color = (0, 0, 0, 0)
            
        image = Image.new("RGBA", (width, height), bg_color)
        draw = ImageDraw.Draw(image)

        # 3. Parse Canvas State (Best Effort)
        # Assuming structure: { "atoms": [ { "id": "...", "x": 10, "y": 10, "w": 100, "h": 100, ... } ] }
        atoms = job.canvas_state.get("atoms", [])
        if isinstance(atoms, dict):
            # Sometimes atoms is a dict indexed by ID
            atoms = atoms.values()
            
        for atom in atoms:
            try:
                # Basic Coordinate parsing
                # Different schemas might use x/left, y/top, w/width, h/height
                ax = atom.get("x", 0)
                ay = atom.get("y", 0)
                aw = atom.get("w", atom.get("width", 100))
                ah = atom.get("h", atom.get("height", 100))
                
                # Props
                props = atom.get("props", {})
                color_hex = props.get("backgroundColor", "#cccccc")
                
                # Draw Rectangle
                # Convert hex to RGB if possible, else gray
                fill_color = self._hex_to_rgba(color_hex)
                
                draw.rectangle([ax, ay, ax + aw, ay + ah], fill=fill_color)
                
                # Very basic type handling
                atype = atom.get("type", "unknown")
                if atype == "text":
                    text_content = props.get("text", "Text")
                    # No font loading yet, standard default provided by PIL if we draw text
                    # keeping it simple: just a rectangle for now for text atoms too
                    pass
                    
            except Exception as e:
                print(f"Failed to render atom {atom.get('id')}: {e}")
                continue

        # 4. Save to Temp File
        tmp_dir = Path(tempfile.gettempdir()) / "atoms_exports"
        tmp_dir.mkdir(exist_ok=True)
        
        filename = f"{job.job_id}.png"
        output_path = tmp_dir / filename
        
        image.save(output_path, "PNG")
        
        return str(output_path)

    def _hex_to_rgba(self, hex_color: str, alpha: int = 255) -> tuple:
        """Simple hex to rgba converter"""
        hex_color = hex_color.lstrip('#')
        try:
            if len(hex_color) == 6:
                return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4)) + (alpha,)
            elif len(hex_color) == 8:
                 return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4, 6))
            else:
                 return (200, 200, 200, alpha)
        except:
             return (200, 200, 200, alpha)
