import io
import os

import pandas as pd
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from src.builder import Builder
from src.config import QUALITY_MAPPING
from src.enums import DataType, VideoQuality
from src.logger import setup_logger

# Load environment variables
load_dotenv()

# Setup logging
logger = setup_logger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Chanim API",
    description="API for dynamic infographics generation",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
security = HTTPBearer()

# Initialize builder
builder = Builder()


class TextRequest(BaseModel):
    text: str
    video_quality: VideoQuality = VideoQuality.MEDIUM


class GenerationResponse(BaseModel):
    status: str
    url: str


def authenticate(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Function to authenticate the user
    token = credentials.credentials
    if token != os.getenv("API_AUTH_KEY"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return True


@app.post("/generate/text", response_model=GenerationResponse, tags=["Infographics"])
async def generate_from_text(request: TextRequest, authenticated: bool = Depends(authenticate)):
    """Generate infographic video from text input"""
    try:
        result = builder.run(
            data=request.text,
            data_type=DataType.TEXT,
            video_quality=request.video_quality,
        )
        quality = QUALITY_MAPPING[request.video_quality]
        video_url = f"media/videos/{quality}/{result}.mp4"
        return GenerationResponse(status="success", url=video_url)
    except Exception as e:
        logger.error(f"Error generating from text: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate/file", response_model=GenerationResponse, tags=["Infographics"])
async def generate_from_file(
    file: UploadFile = File(...),
    video_quality: VideoQuality = Form(VideoQuality.MEDIUM),
    authenticated: bool = Depends(authenticate),
):
    """Generate infographic video from file input"""
    try:
        file_extension = file.filename.split(".")[-1].lower()
        if file_extension not in ["csv", "txt"]:
            raise HTTPException(
                status_code=400, detail="Only CSV and TXT files are supported"
            )

        content = await file.read()

        if file_extension == "csv":
            df = pd.read_csv(io.StringIO(content.decode()))
            data = df
            data_type = DataType.CSV
        else:
            data = content.decode()
            data_type = DataType.TEXT

        result = builder.run(
            data=data, data_type=data_type, video_quality=video_quality
        )
        quality = QUALITY_MAPPING[video_quality]
        video_url = f"media/videos/{quality}/{result}.mp4"
        return GenerationResponse(status="success", url=video_url)
    except Exception as e:
        logger.error(f"Error generating from file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("api:app", host="0.0.0.0", port=8000)
