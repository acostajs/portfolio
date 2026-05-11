import subprocess
import sys

def run_command(command, cwd=None):
    """Utility to run shell commands and report status."""
    print(f"🚀 Running: {' '.join(command)}")
    result = subprocess.run(command, cwd=cwd, capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"❌ Failed: {' '.join(command)}")
        print(result.stdout)
        print(result.stderr)
        return False
    
    print(f"✅ Success: {' '.join(command)}")
    return True

def audit_frontend():
    """Checks types, lint, test, and format for the React frontend."""
    print("\n--- 🌐 Frontend Audit ---")
    steps = [
        ["bun", "run", "lint"],         # Linting
        ["bun", "tsc", "--noEmit"],      # Type Checking
        ["bun", "test"],                 # Unit Tests
        ["bun", "x", "prettier", "--check", "."]     # Format Check
    ]
    
    return all(run_command(step, cwd="./frontend") for step in steps)

def audit_backend():
    """Runs ruff check, ruff format, and pytest for the FastAPI backend."""
    print("\n--- 🐍 Backend Audit ---")
    steps = [
        ["uv", "run", "ruff", "check", "."],    # Linting
        ["uv", "run", "ruff", "format", "--check", "."], # Formatting
        ["uv", "run", "pytest"]                 # Testing
    ]
    
    return all(run_command(step, cwd="./backend") for step in steps)

def run_quality_audit():
    """Triggers the full project validation suite."""
    fe_pass = audit_frontend()
    be_pass = audit_backend()
    
    if fe_pass and be_pass:
        print("\n🎉 ALL AUDITS PASSED!")
        sys.exit(0)
    else:
        print("\n⚠️ Audit failures detected. Review the logs above.")
        sys.exit(1)

if __name__ == "__main__":
    run_quality_audit()