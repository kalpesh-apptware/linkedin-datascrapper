from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime
import os
import re

app = FastAPI(title="MCP Server – Google Sheets Proxy")

PERMANENT_GOOGLE_SHEET_LINK = (
    "https://docs.google.com/spreadsheets/d/1Ql-bEOfrxUBMrruYNUvLjveCt6VYbCL4NS2lVKlZloM/edit?usp=sharing"
)

def extract_sheet_id(url: str) -> str:
    """Extract Google Sheet ID from URL"""
    match = re.search(r'/spreadsheets/d/([a-zA-Z0-9-_]+)', url)
    return match.group(1) if match else None

# Extract sheet ID from URL
SHEET_ID = extract_sheet_id(PERMANENT_GOOGLE_SHEET_LINK) or "1Ql-bEOfrxUBMrruYNUvLjveCt6VYbCL4NS2lVKlZloM"

class SheetPayload(BaseModel):
    data: List[Dict]

def write_to_google_sheets(data: List[Dict], timestamp: str):
    """Background function to write data to Google Sheets"""
    try:
        import gspread
        from google.oauth2.service_account import Credentials
        
        # Check for credentials file
        creds_file = os.getenv("GOOGLE_CREDENTIALS_FILE", "credentials.json")
        # If not found in current dir, try backend directory
        if not os.path.exists(creds_file):
            backend_creds = os.path.join(os.path.dirname(__file__), "credentials.json")
            if os.path.exists(backend_creds):
                creds_file = backend_creds
        
        if os.path.exists(creds_file):
            print("🔐 Authenticating with Google Sheets API...")
            scope = ['https://www.googleapis.com/auth/spreadsheets']
            creds = Credentials.from_service_account_file(creds_file, scopes=scope)
            client = gspread.authorize(creds)
            
            print("📂 Opening Google Sheet...")
            sheet = client.open_by_key(SHEET_ID)
            worksheet = sheet.sheet1
            
            print("📋 Reading existing data...")
            existing_data = worksheet.get_all_values()
            
            # Determine headers
            if not existing_data or not existing_data[0]:
                headers = list(data[0].keys()) if data else []
                print(f"➕ Adding headers: {headers}")
                worksheet.append_row(headers)
                existing_data = [headers]
            else:
                headers = existing_data[0]
                print(f"📝 Using existing headers: {headers}")
            
            # Prepare data rows
            print("🔄 Preparing data rows...")
            rows_to_append = []
            for row in data:
                row_values = [str(row.get(header, '')) for header in headers]
                rows_to_append.append(row_values)
            
            # Append rows
            if rows_to_append:
                print(f"💾 Writing {len(rows_to_append)} rows to Google Sheet...")
                worksheet.append_rows(rows_to_append)
                print(f"✅ Successfully appended {len(rows_to_append)} rows to Google Sheet")
        else:
            print(f"⚠️  Google credentials file not found at: {creds_file}")
    except Exception as e:
        print(f"❌ Error writing to Google Sheets: {e}")
        import traceback
        traceback.print_exc()


@app.post("/api/v1/sheet_upload")
def append_to_google_sheet(payload: SheetPayload, background_tasks: BackgroundTasks):
    """
    APPEND-ONLY MCP SERVER

    - Google Sheet link is permanent
    - No new sheet creation
    - Every request appends rows
    - Returns immediately, processes in background
    """

    print("📥 MCP SERVER RECEIVED DATA")
    print("📄 Target Sheet:", PERMANENT_GOOGLE_SHEET_LINK)
    print(f"📊 Received {len(payload.data)} records")

    timestamp = datetime.utcnow().isoformat()

    # Add timestamp to each row
    for row in payload.data:
        row["ingested_at"] = timestamp
    
    # Print first few records for debugging
    for i, row in enumerate(payload.data[:3]):
        print(f"  Record {i+1}: {row.get('name', 'N/A')}")
    if len(payload.data) > 3:
        print(f"  ... and {len(payload.data) - 3} more records")

    # Process Google Sheets write in background to avoid timeout
    background_tasks.add_task(write_to_google_sheets, payload.data, timestamp)
    
    # Return immediately to prevent timeout
    return {
        "status": "success",
        "sheet": PERMANENT_GOOGLE_SHEET_LINK,
        "rows_appended": len(payload.data),
        "message": "Data queued for Google Sheets write"
    }
