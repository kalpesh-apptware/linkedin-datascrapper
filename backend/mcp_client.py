import os
import requests

MCP_SERVER_URL = os.getenv(
    "MCP_SERVER_URL",
    "http://localhost:9000/api/v1/sheet_upload"
)


class McpClient:
    def push(self, records):
        try:
            response = requests.post(
                MCP_SERVER_URL,
                json={"data": records},
                timeout=60  # Increased timeout for Google Sheets API operations
            )
            response.raise_for_status()
            return True
        except requests.RequestException as e:
            print("❌ MCP SERVER ERROR:", e)
            raise
