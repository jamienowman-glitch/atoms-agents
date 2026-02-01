"""
Build Script for Junior Agent Security.
Uses PyInstaller to create a macOS App Bundle.
"""
import PyInstaller.__main__
import os
import shutil

# Clean previous builds
if os.path.exists("build"): shutil.rmtree("build")
if os.path.exists("dist"): shutil.rmtree("dist")

# Define build arguments
args = [
    "junior_agent_security/main.py",           # Validation Script
    "--name=JuniorAgentSecurity",              # App Name
    "--windowed",                              # No console window (GUI mode)
    # "--icon=resources/AppIcon.icns",           # App Icon (Commented out until valid ICNS provided)
    "--add-data=junior_agent_security/dashboard/templates:junior_agent_security/dashboard/templates", # Templates
    "--collect-all=fastapi",
    "--collect-all=uvicorn",
    "--collect-all=mcp",
    "--clean",
    "--noconfirm",
]

print("📦 Building Junior Agent Security App Bundle...")
PyInstaller.__main__.run(args)

print("\n✅ Build Complete!")
print("   App Bundle: dist/JuniorAgentSecurity.app")
print("   Executable: dist/JuniorAgentSecurity.app/Contents/MacOS/JuniorAgentSecurity")
print("\n👉 To run MCP server manually:")
print("   dist/JuniorAgentSecurity.app/Contents/MacOS/JuniorAgentSecurity mcp-serve")
