# Google Sheets API Setup Guide

## Step 1: Create Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 2: Create Service Account Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details and click "Create"
4. Skip role assignment (optional) and click "Done"
5. Click on the created service account
6. Go to "Keys" tab > "Add Key" > "Create new key"
7. Choose "JSON" format and download the key file

## Step 3: Share Google Sheet with Service Account

1. Open your Google Sheet: `https://docs.google.com/spreadsheets/d/1Ql-bEOfrxUBMrruYNUvLjveCt6VYbCL4NS2lVKlZloM/edit`
2. Click "Share" button
3. Copy the **email address** from the downloaded JSON file (look for `client_email` field)
4. Paste the email in the "Share" dialog
5. Give it "Editor" permissions
6. Click "Send"

## Step 4: Place Credentials File

1. Rename the downloaded JSON file to `credentials.json`
2. Place it in the `backend/` directory
3. Or set the path via environment variable: `GOOGLE_CREDENTIALS_FILE=path/to/credentials.json`

## Step 5: Test

Restart your MCP server and try uploading a screenshot. The data should now appear in your Google Sheet!

