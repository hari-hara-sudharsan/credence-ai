import json
import sys
try:
    import websocket
except ImportError:
    print("websocket-client not installed. Installing it...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "websocket-client"])
    import websocket

ws_url = "ws://localhost:9222/devtools/page/8FA489F998A116FFD9245E7D606AE50E"

def get_logs():
    ws = websocket.create_connection(ws_url, suppress_origin=True)
    # Enable console/runtime
    ws.send(json.dumps({"id": 1, "method": "Runtime.enable"}))
    ws.send(json.dumps({"id": 2, "method": "Log.enable"}))
    
    # Wait for logs and messages (we will read for 2 seconds)
    import time
    start = time.time()
    ws.settimeout(0.5)
    
    print("LOGS CAPTURED:")
    while time.time() - start < 3:
        try:
            msg = ws.recv()
            data = json.loads(msg)
            # Check console/runtime events
            if "method" in data:
                method = data["method"]
                params = data.get("params", {})
                if method == "Runtime.consoleAPICalled":
                    args = params.get("args", [])
                    log_text = " ".join([arg.get("value", str(arg)) for arg in args])
                    print(f"[{params.get('type')}] {log_text}")
                elif method == "Log.entryAdded":
                    entry = params.get("entry", {})
                    print(f"[{entry.get('level')}] {entry.get('text')}")
        except websocket.WebSocketTimeoutException:
            pass
        except Exception as e:
            print("ERROR:", str(e))
            break
    ws.close()

if __name__ == "__main__":
    get_logs()
