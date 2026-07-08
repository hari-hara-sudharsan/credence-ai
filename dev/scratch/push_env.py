import os
import subprocess
import shutil
import time

env_path = r"c:\Users\Windows\credence-ai\.env"
vars_to_push = [
    "PRIVATE_KEY",
    "HSK_RPC",
    "CREDIT_REGISTRY",
    "GROQ_API_KEY",
    "LOAN_MANAGER",
    "LOAN_MANAGER_ADDRESS",
    "ORACLE_REGISTRY_ADDRESS",
    "CREDIT_PASSPORT_V2_ADDRESS",
    "VERIFICATION_REGISTRY_ADDRESS",
    "GOVERNANCE_REGISTRY_ADDRESS",
    "REPUTATION_REGISTRY_ADDRESS",
    "SETTLEMENT_MANAGER_ADDRESS",
    "LENDING_POOL_ADDRESS"
]

vercel_path = shutil.which("vercel") or "vercel"
print(f"Using Vercel CLI path: {vercel_path}")

def run_cmd(key, target_env, val):
    print(f"\n--- Pushing {key} to {target_env} ---")
    cmd_args = [vercel_path, "env", "add", key, target_env, "--yes", "--force"]
    
    env = os.environ.copy()
    env["VERCEL_TELEMETRY_DISABLED"] = "1"
    env["CI"] = "1"
    
    try:
        res = subprocess.run(
            cmd_args,
            input=val,
            text=True,
            capture_output=True, # Capture output so we can print it
            cwd=r"c:\Users\Windows\credence-ai\frontend",
            shell=False,
            timeout=25,
            env=env
        )
        if res.stdout:
            print(f"STDOUT:\n{res.stdout.strip()}")
        if res.stderr:
            print(f"STDERR:\n{res.stderr.strip()}")
            
        if res.returncode != 0:
            print(f"Result: Failed (exit code {res.returncode})")
        else:
            print("Result: Success")
    except subprocess.TimeoutExpired as te:
        print("Result: Timeout Expired")
        if te.stdout:
            print(f"Captured STDOUT before timeout:\n{te.stdout.decode('utf-8', errors='ignore')}")
        if te.stderr:
            print(f"Captured STDERR before timeout:\n{te.stderr.decode('utf-8', errors='ignore')}")
    except Exception as e:
        print(f"Result: Error ({e})")

if os.path.exists(env_path):
    tasks = []
    with open(env_path, "r") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                key, val = line.split("=", 1)
                key = key.strip()
                val = val.strip()
                if val.startswith('"') and val.endswith('"'):
                    val = val[1:-1]
                elif val.startswith("'") and val.endswith("'"):
                    val = val[1:-1]
                if key in vars_to_push:
                    for target_env in ["production", "preview", "development"]:
                        tasks.append((key, target_env, val))
                        
    print(f"Executing {len(tasks)} environment variable tasks sequentially...")
    for idx, (key, target_env, val) in enumerate(tasks):
        print(f"Progress: {idx+1}/{len(tasks)}")
        run_cmd(key, target_env, val)
        time.sleep(1.5)
    print("\nAll tasks completed sequentially.")
else:
    print(".env file not found")
