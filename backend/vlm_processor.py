import base64
import requests
from io import BytesIO
from PIL import Image

import os

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
MODEL_NAME = "qwen2.5vl"


class QwenOllamaProcessor:
    """
    Singleton wrapper for Ollama VLM.
    GPU is handled internally by Ollama.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    @staticmethod
    def _image_to_base64(image: Image.Image) -> str:
        buffer = BytesIO()
        image.convert("RGB").save(buffer, format="PNG")
        return base64.b64encode(buffer.getvalue()).decode("utf-8")

    def extract(self, image: Image.Image, prompt: str) -> str:
        image_b64 = self._image_to_base64(image)

        payload = {
            "model": MODEL_NAME,
            "prompt": prompt,
            "images": [image_b64],
            "stream": False,
            "options": {
                "temperature": 0,
                "num_predict": 700
            }
        }

        response = requests.post(
            OLLAMA_URL,
            json=payload,
            timeout=120
        )
        response.raise_for_status()

        return response.json()["response"]
