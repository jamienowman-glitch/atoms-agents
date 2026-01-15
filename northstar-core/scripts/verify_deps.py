"""
Verify orchestration framework dependencies are installed.
"""
import sys

def check_import(package_name):
    try:
        __import__(package_name)
        print(f"✅ {package_name} imported successfully.")
        return True
    except ImportError as e:
        print(f"❌ {package_name} NOT found. ({e})")
        return False

def main():
    print("Verifying Orchestration Dependencies...")
    packages = ["langgraph", "crewai"]
    
    all_ok = True
    for pkg in packages:
        if not check_import(pkg):
            all_ok = False
            
    # Check for AutoGen (namespaces: autogen_agentchat / autogen_core)
    # Note: 'pyautogen' installs these namespaces.
    if check_import("autogen_agentchat"):
        pass
    elif check_import("autogen_core"):
        print("✅ autogen_core imported successfully (fallback).")
    else:
        print("❌ autogen packages NOT found.")
        all_ok = False
            
    if all_ok:
        print("All dependencies verified.")
        sys.exit(0)
    else:
        print("Some dependencies missing.")
        sys.exit(1)

if __name__ == "__main__":
    main()
