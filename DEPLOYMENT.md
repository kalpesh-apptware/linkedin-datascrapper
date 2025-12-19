# Deployment Guide

This guide explains how to deploy the LinkedIn OCR application (Backend + Frontend) to a server using Docker and GitHub Actions.

## Prerequisites

1. **Server (VPS)**: A server running Linux (Ubuntu recommended).
2. **Domain (Optional)**: If you want to access the app via a domain name.
3. **Docker Hub Account**: To host the Docker images (or use GitHub Container Registry).
4. **Google Cloud Credentials**: `credentials.json` for the Google Sheets integration.
5. **Ollama**: Running on the server (or accessible via network) for `qwen2.5vl` model.

## 0. Initial Setup (Local Machine)

Before deploying, you need to push this code to GitHub.

1.  **Initialize Git**:
    Open your terminal in `d:\linkedin_ocr` and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit of LinkedIn OCR app"
    ```

2.  **Push to GitHub**:
    - Create a new repository on GitHub (e.g., `linkedin-ocr-app`).
    - Link it and push:
    ```bash
    git remote add origin https://github.com/<YOUR-USERNAME>/linkedin-ocr-app.git
    git branch -M main
    git push -u origin main
    ```

## 1. Server Setup (Using Termius)

You can use **Termius** to manage your server.

1.  **Create a Host**:
    - Open Termius -> New Host.
    - **Address**: Your Server IP (e.g., `123.45.67.89`).
    - **Username**: `root` (or your user).
    - **Password** or **Key**: Enter your credentials.
    - Save and double-click to connect.

2.  **Install Software**:
    Once connected (black terminal screen), copy and paste this block to set up everything:

    ```bash
    # Update system
    sudo apt-get update && sudo apt-get upgrade -y

    # Install Docker & Docker Compose
    sudo apt-get install -y docker.io docker-compose
    sudo systemctl enable --now docker

    # Install Ollama (AI Model runner)
    curl -fsSL https://ollama.com/install.sh | sh
    
    # helper: wait for ollama to start then pull model
    ollama pull qwen2.5vl
    ```

## 2. GitHub Secrets

Go to your GitHub Repository -> Settings -> Secrets and variables -> Actions, and add the following secrets:

| Secret Name | Description |
|---|---|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Your Docker Hub password (or Access Token) |
| `SERVER_HOST` | IP address or domain of your VPS |
| `SERVER_USER` | SSH username (e.g., `root` or `ubuntu`) |
| `SSH_PRIVATE_KEY` | Your private SSH key (content of `.pem` or `id_rsa`) to access the server |

## 3. Environment Configuration

### Backend
The backend uses `credentials.json` for Google Sheets.
- Ensure `backend/credentials.json` exists in your repository (Note: Don't commit real credentials if public!).
- Alternatively, you can use GitHub Secrets to inject `credentials.json` during the build or deployment if security is a concern.

### Frontend
The frontend connects to the backend. By default, it expects the backend at `http://localhost:8000`.
- In production, if you host on a domain, you might need to update this.
- If using `docker-compose`, the frontend runs on port 80 (mapped to 3000) and backend on 8000. Ensure 8000 is open in your firewall.

## 4. Manual Deployment (Testing)

To test the deployment on your server manually without GitHub Actions:

1. Copy the project to the server.
2. Run:
   ```bash
   docker-compose up -d --build
   ```
3. Access Frontend at `http://<your-server-ip>:3000`
4. Access Backend at `http://<your-server-ip>:8000/docs`

## 5. CI/CD Pipeline

The included `.github/workflows/deploy.yml` automates the deployment.
- **Trigger**: Push to `main` branch.
- **Action**: Builds Docker images, pushes to Docker Hub, SSHs into server, pulls new images, and restarts containers.

> [!NOTE]
> The workflow assumes the repository is cloned in a folder named `linkedin_ocr` on the server user's home directory. If not, it clones it.

## Troubleshooting

- **Ollama Connection**: The backend tries to connect to Ollama.
    - We set `OLLAMA_URL=http://host.docker.internal:11434/api/generate` in `docker-compose.yml`.
    - If this fails on Linux, try setting `network_mode: host` for the backend service or ensure Ollama is listening on all interfaces (`OLLAMA_HOST=0.0.0.0`).
