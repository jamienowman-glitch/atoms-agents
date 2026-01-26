
import sys
import os
from PIL import Image

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), "../src"))

from core.nexus.embedding_free import FreeEmbeddingAdapter

def test_stack():
    print("🚀 Starting Nexus Free Stack Verification...")
    adapter = FreeEmbeddingAdapter()

    # 1. Test Text (Mistral)
    print("\n[1/3] Testing Mistral Text Embeddings...")
    try:
        vec = adapter.embed_text("Hello Northstar User")
        print(f"✅ Success! Vector Length: {len(vec)} (Expected 1024)")
    except Exception as e:
        print(f"❌ Failed: {e}")

    # 2. Test Image (OpenCLIP)
    print("\n[2/3] Testing OpenCLIP Image Embeddings (Local)...")
    try:
        # Create dummy image
        img_path = "test_image.jpg"
        img = Image.new('RGB', (100, 100), color = 'red')
        img.save(img_path)

        vec = adapter.embed_image(img_path)
        print(f"✅ Success! Vector Length: {len(vec)} (Expected 512)")
        
        # Cleanup
        os.remove(img_path)
    except Exception as e:
        print(f"❌ Failed: {e}")

    # 3. Test UMAP (3D Map)
    print("\n[3/3] Testing UMAP 3D Projection...")
    try:
        # Create dummy vectors (UMAP needs > 2 usually)
        vectors = [[0.1 * i] * 512 for i in range(10)]
        coords = adapter.generate_map_coords(vectors)
        print(f"✅ Success! Projected {len(coords)} vectors to 3D.")
        print(f"   Sample: {coords[0]}")
    except Exception as e:
        print(f"❌ Failed: {e}")

if __name__ == "__main__":
    test_stack()
