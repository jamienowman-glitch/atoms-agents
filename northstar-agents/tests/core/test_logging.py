
import os
import json
from northstar.core.logging import StructuredLogger

def test_logging(tmp_path):
    log_dir = str(tmp_path / "logs")
    logger = StructuredLogger(log_dir)
    
    logger.info("Hello World", user="me")
    logger.error("Something bad", error_code=500)
    
    # Find the log file
    files = os.listdir(log_dir)
    assert len(files) == 1
    log_file = os.path.join(log_dir, files[0])
    
    with open(log_file, 'r') as f:
        lines = f.readlines()
        
    assert len(lines) == 2
    
    entry1 = json.loads(lines[0])
    assert entry1["level"] == "INFO"
    assert entry1["message"] == "Hello World"
    assert entry1["user"] == "me"
    
    entry2 = json.loads(lines[1])
    assert entry2["level"] == "ERROR"
    assert entry2["error_code"] == 500
