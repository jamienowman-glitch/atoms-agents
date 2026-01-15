import pytest
import os
from unittest.mock import patch, MagicMock
from engines.common.identity import RequestContext
from engines.connectors.local_dev.impl import read_file, write_file, list_files, run_shell, ReadFileInput, WriteFileInput, ListFilesInput, RunShellInput

def test_local_dev_flow(tmp_path):
    import asyncio
    asyncio.run(_async_test_local_dev_flow(tmp_path))

async def _async_test_local_dev_flow(tmp_path):
    ctx = RequestContext(tenant_id="t_dev", env="dev", mode="lab", user_id="u1")
    
    # Configure Secrets to point to this temp path as ROOT
    with patch("engines.connectors.local_dev.impl.LocalSecretStore") as MockStore:
        MockStore.return_value.get_secret.return_value = str(tmp_path)
        
        # 1. Write File
        resp_write = await write_file(ctx, WriteFileInput(path="hello.txt", content="Hello World"))
        assert resp_write["status"] == "written"
        assert (tmp_path / "hello.txt").exists()
        
        # 2. Read File
        resp_read = await read_file(ctx, ReadFileInput(path="hello.txt"))
        assert resp_read["content"] == "Hello World"
        
        # 3. List Files
        resp_list = await list_files(ctx, ListFilesInput(path="."))
        assert "hello.txt" in resp_list["files"]
        
        # 4. Run Shell (Echo)
        resp_shell = await run_shell(ctx, RunShellInput(command="echo 'Shell Works'", cwd="."))
        assert "Shell Works" in resp_shell["stdout"]
        
        # 5. Security Check: Path Traversal
        # Try to access parent of root
        try:
            await read_file(ctx, ReadFileInput(path="../outside.txt"))
            assert False, "Should have raised ValueError"
        except ValueError as e:
            assert "Access Denied" in str(e)
            
        print("Local Dev Flow Verified!")
