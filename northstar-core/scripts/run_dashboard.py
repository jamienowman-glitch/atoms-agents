#!/usr/bin/env python3
import http.server
import socketserver
import os
import yaml
import glob
from urllib.parse import urlparse, parse_qs

PORT = 8080
RUN_LOGS_DIR = "registry/run_logs"
RUN_ARTIFACTS_DIR = "registry/run_artifacts"

class DashboardHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        
        if path == "/":
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            self.wfile.write(self.render_index().encode())
        elif path.startswith("/run/"):
            run_id = path.split("/")[-1]
            # Find log file for this run_id
            log_files = glob.glob(os.path.join(RUN_LOGS_DIR, f"*.{run_id}*.yaml")) # Match somewhat loosely to find the file
             # fallback if format is different
            if not log_files:
                 # Check if the run_id is actually embedded in a filename differently
                 all_logs = glob.glob(os.path.join(RUN_LOGS_DIR, "*.yaml"))
                 for l in all_logs:
                     if run_id in l:
                         log_files = [l]
                         break
            
            if log_files:
                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                self.wfile.write(self.render_run(log_files[0]).encode())
            else:
                self.send_error(404, "Run Log Not Found")
        
        elif path.startswith("/artifact/"):
            # Serve artifact content
            # /artifact/<run_id>/<filename>
            parts = path.split("/")
            if len(parts) >= 4:
                run_id = parts[2]
                filename = parts[3]
                file_path = os.path.join(RUN_ARTIFACTS_DIR, run_id, filename)
                if os.path.exists(file_path):
                     self.send_response(200)
                     self.send_header("Content-type", "text/plain")
                     self.end_headers()
                     with open(file_path, "rb") as f:
                         self.wfile.write(f.read())
                else:
                    self.send_error(404, "Artifact Not Found")
            else:
                 self.send_error(400, "Invalid Artifact Path")

        else:
             super().do_GET()

    def render_index(self):
        # Scan logs
        logs = glob.glob(os.path.join(RUN_LOGS_DIR, "runtime_test.doc_blackboard.*.yaml"))
        logs.sort(key=os.path.getmtime, reverse=True)
        
        html = """
        <html>
        <head>
            <style>
                body { font-family: monospace; background: white; color: black; padding: 20px; }
                table { border-collapse: collapse; width: 100%; border: 1px solid black; }
                th, td { border: 1px solid black; padding: 8px; text-align: left; }
                a { color: black; text-decoration: underline; }
                h1 { border-bottom: 2px solid black; padding-bottom: 10px; }
            </style>
        </head>
        <body>
            <h1>Doc Blackboard Runs</h1>
            <table>
                <tr>
                    <th>Timestamp</th>
                    <th>Runtime</th>
                    <th>Run ID</th>
                    <th>Initial Doc</th>
                    <th>Status</th>
                    <th>Link</th>
                </tr>
        """
        
        for log_path in logs:
            try:
                with open(log_path, 'r') as f:
                    data = yaml.safe_load(f)
                    
                ts = data.get("start_timestamp", "N/A")
                run_id = data.get("run_id", "N/A")
                summary = data.get("summary", "")
                runtime = summary.split(" ")[0] if summary else "unknown"
                input_doc = os.path.basename(data.get("input_document", "None"))
                
                html += f"""
                <tr>
                    <td>{ts}</td>
                    <td>{runtime}</td>
                    <td>{run_id}</td>
                    <td>{input_doc}</td>
                    <td>DONE</td>
                    <td><a href="/run/{run_id}">View Details</a></td>
                </tr>
                """
            except Exception as e:
                continue

        html += """
            </table>
        </body>
        </html>
        """
        return html

    def render_run(self, log_path):
        with open(log_path, 'r') as f:
            data = yaml.safe_load(f)
            
        run_id = data.get("run_id", "Unknown")
        input_doc = data.get("input_document", "")
        steps = data.get("steps", [])
        
        input_doc_name = os.path.basename(input_doc)
        # Create a link to the input doc if it exists in artifacts
        input_doc_link = f"/artifact/{run_id}/input_document_{input_doc_name}"
        
        html = f"""
        <html>
        <head>
            <style>
                body {{ font-family: monospace; background: white; color: black; padding: 20px; }}
                table {{ border-collapse: collapse; width: 100%; border: 1px solid black; margin-top: 20px; }}
                th, td {{ border: 1px solid black; padding: 8px; vertical-align: top; }}
                .type-upload {{ font-weight: bold; }}
                pre {{ white-space: pre-wrap; word-break: break-all; margin: 0; }}
                a {{ color: black; text-decoration: underline; }}
                .back {{ display: block; margin-bottom: 20px; }}
            </style>
        </head>
        <body>
            <a href="/" class="back"><< Back to Run List</a>
            <h1>Run Details: {run_id}</h1>
            <div>
                <strong>Input Document:</strong> <a href="{input_doc_link}" target="_blank">{input_doc}</a>
            </div>
            
            <table>
                <tr>
                    <th>Step</th>
                    <th>Type</th>
                    <th>Description / Preview</th>
                    <th>Artifact (.txt)</th>
                    <th>Latency (ms)</th>
                </tr>
        """
        
        # Add Input Step Row
        html += f"""
        <tr>
            <td>0</td>
            <td class="type-upload">UPLOAD</td>
            <td>Document Uploaded: {input_doc}</td>
            <td><a href="{input_doc_link}" target="_blank">Download</a></td>
            <td>0</td>
        </tr>
        """
        
        for step in steps:
            idx = step.get("step_index", "")
            agent = step.get("agent_id", "")
            text = step.get("emitted_text", "")
            preview = (text[:100] + '...') if len(text) > 100 else text
            latency = "{:.2f}".format(float(step.get("step_latency_ms", 0)))
            
            artifact_rel = step.get("artifact_rel_path", "")
            artifact_link = ""
            if artifact_rel:
                # artifact_rel format: run_id/filename
                # we need to serve it via /artifact/run_id/filename
                parts = artifact_rel.split("/")
                if len(parts) == 2:
                    artifact_link = f"<a href='/artifact/{parts[0]}/{parts[1]}' target='_blank'>View Full</a>"
            
            html += f"""
            <tr>
                <td>{idx}</td>
                <td>AGENT ({agent})</td>
                <td><pre>{preview}</pre></td>
                <td>{artifact_link}</td>
                <td>{latency}</td>
            </tr>
            """
            
        html += """
            </table>
        </body>
        </html>
        """
        return html

if __name__ == "__main__":
    # Ensure directories exist
    os.makedirs(RUN_LOGS_DIR, exist_ok=True)
    os.makedirs(RUN_ARTIFACTS_DIR, exist_ok=True)
    
    with socketserver.TCPServer(("", PORT), DashboardHandler) as httpd:
        print(f"Serving Local Dashboard at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
