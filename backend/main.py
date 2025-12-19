from fastapi import FastAPI, UploadFile, File, BackgroundTasks, status
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PIL import Image
import json
import pandas as pd
import re
from datetime import datetime

from vlm_processor import QwenOllamaProcessor
from mcp_client import McpClient

app = FastAPI(title="Screenshot → Google Sheet (Qwen2.5-VL)")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:5174",
        "http://localhost:8080",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vlm = QwenOllamaProcessor()
mcp = McpClient()

# 🔑 PROMPT TUNED FOR LINKEDIN-LIKE SCREENSHOTS
EXTRACTION_PROMPT = """
You are an expert at analyzing screenshots containing multiple person profile cards.

For EACH visible profile card, extract:
- name
- title_or_role
- organization_or_context
- education_or_tagline (if visible)

Return ONLY a JSON array.
Each object must represent ONE person.
Do not include explanations or markdown.
"""

def robust_json_parser(text: str):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\[.*\]", text, re.DOTALL)
        if not match:
            raise ValueError("No JSON array found in model output")
        return json.loads(match.group())


def process_screenshot(file_bytes: bytes, filename: str):
    try:
        image = Image.open(BytesIO(file_bytes))

        print(f"🚀 Processing screenshot: {filename}")

        raw_output = vlm.extract(image, EXTRACTION_PROMPT)

        records = robust_json_parser(raw_output)

        df = pd.DataFrame.from_records(records)

        # 🔥 Final normalization layer
        df["source_file"] = filename
        df["processed_at"] = datetime.utcnow().isoformat()

        normalized_records = df.to_dict(orient="records")

        mcp.push(normalized_records)

        print(f"✅ SUCCESS: {filename}")

    except Exception as e:
        print(f"❌ FAILED {filename}: {e}")


@app.post("/upload/extract", status_code=status.HTTP_202_ACCEPTED)
async def upload_screenshot(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    content = await file.read()

    background_tasks.add_task(
        process_screenshot,
        content,
        file.filename
    )

    return {
        "message": "Screenshot accepted",
        "filename": file.filename,
        "status": "processing"
    }
