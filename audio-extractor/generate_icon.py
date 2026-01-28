
from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(output_path="icon.png"):
    size = (1024, 1024)
    # Create dark background
    img = Image.new('RGBA', size, (13, 13, 13, 255))
    draw = ImageDraw.Draw(img)

    # Draw gradient circle or shape
    # Since gradient is hard with basic PIL, we do concentric circles for effect
    center = (512, 512)
    radius = 480
    
    # Outer ring (simulating glow)
    draw.ellipse([center[0]-radius, center[1]-radius, center[0]+radius, center[1]+radius], 
                 outline=(0, 255, 136), width=20)
    
    # Inner fill (darker)
    draw.ellipse([center[0]-radius+20, center[1]-radius+20, center[0]+radius-20, center[1]+radius-20], 
                 fill=(26, 26, 26))

    # Draw "A" or Audio Symbol
    # Let's draw a simple waveform representation
    # Green bars
    bar_width = 80
    spacing = 40
    color = (0, 255, 136)
    
    video_center_x = 512
    # Bar heights relative to center
    heights = [200, 350, 250, 400, 300]
    
    total_width = len(heights) * bar_width + (len(heights) - 1) * spacing
    start_x = video_center_x - (total_width // 2)
    
    for i, h in enumerate(heights):
        x = start_x + i * (bar_width + spacing)
        y_top = 512 - (h // 2)
        y_bottom = 512 + (h // 2)
        draw.rectangle([x, y_top, x+bar_width, y_bottom], fill=color)

    img.save(output_path)
    print(f"Icon saved to {output_path}")

if __name__ == "__main__":
    create_icon()
