import sys
import os
import uuid
from datetime import datetime

# No more sys.path hacks. Use uv run to resolve absolute atoms_muscle.* aliases.
try:
    from atoms_muscle.export.universal.service import service
    from atoms_muscle.export.universal.models import ExportJob, AuthContext, OutputParams
except ImportError as e:
    print(f"Import Error: {e}")
    print("MANDATORY: Execute this script using 'uv run' from the root workspace.")
    sys.exit(1)

def test_export(format_type):
    print(f"\n--- Testing {format_type.upper()} Export ---")
    
    # Mock Canvas State
    canvas_state = {
        "atoms": [
            {
                "id": "atom_1",
                "x": 100, "y": 100, "w": 200, "h": 200,
                "props": {"backgroundColor": "#FF5733", "text": "Hello World"}
            },
            {
                "id": "atom_2",
                "x": 400, "y": 100, "w": 100, "h": 100,
                "props": {"backgroundColor": "#33FF57"}
            }
        ]
    }
    
    # Create Job
    job = ExportJob(
        job_id=str(uuid.uuid4()),
        canvas_state=canvas_state,
        target_format=format_type,
        output_params=OutputParams(width=1920, height=1080, include_background=True),
        auth_context=AuthContext(tenant_id="test-tenant", env="dev")
    )
    
    try:
        print("Calling service.export()...")
        result = service.export(job)
        print(f"✅ Success!")
        print(f"Job ID: {result.job_id}")
        print(f"Artifact URI: {result.artifact.uri}")
        print(f"Size: {result.artifact.size_bytes} bytes")
        
        if result.artifact.uri.startswith("s3://"):
             print("✅ Artifact URI is a valid S3 path.")
        else:
             print("❌ Artifact URI is NOT an S3 path.")
             
    except Exception as e:
        print(f"❌ Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print(f"Running Universal Export Verification")
    print(f"CWD: {os.getcwd()}")
    
    test_export("png")
    test_export("pdf")
    # test_export("pptx") # Should fail as not implemented
