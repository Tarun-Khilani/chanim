import io
import os

import pandas as pd
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from app.builder import Builder
from app.config import QUALITY_MAPPING
from app.enums import DataType, VideoQuality
from app.logger import setup_logger
from app.models import InfographicRemotionResponse, StoryRemotionResponse

# Load environment variables
load_dotenv()

# Setup logging
logger = setup_logger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Chanim API",
    description="API for dynamic infographics generation",
    version="0.1.0",
    root_path="/api/v1",
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
    # video_quality: VideoQuality = VideoQuality.MEDIUM


class CodeResponse(BaseModel):
    code: str


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


@app.get("/healthcheck")
async def healthcheck():
    return {"status": "healthy"}


@app.post("/gen-text/manim-video", response_class=FileResponse, tags=["Infographics"])
async def generate_from_text_manim(
    request: TextRequest, authenticated: bool = Depends(authenticate)
):
    """Generate infographic video from text input"""
    try:
        result = builder.run(
            data=request.text,
            data_type=DataType.TEXT,
            video_quality=VideoQuality.MEDIUM,
        )
        quality = QUALITY_MAPPING[VideoQuality.MEDIUM]
        video_url = f"media/videos/{quality}/{result}.mp4"
        return FileResponse(video_url)
    except Exception as e:
        logger.error(f"Error generating from text: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/gen-file/manim-video", response_class=FileResponse, tags=["Infographics"])
async def generate_from_file_manim(
    file: UploadFile = File(...),
    # video_quality: VideoQuality = Form(VideoQuality.MEDIUM),
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
            data=data, data_type=data_type, video_quality=VideoQuality.MEDIUM
        )
        quality = QUALITY_MAPPING[VideoQuality.MEDIUM]
        video_url = f"media/videos/{quality}/{result}.mp4"
        return FileResponse(video_url)
    except Exception as e:
        logger.error(f"Error generating from file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/gen-text/infographic", response_model=InfographicRemotionResponse, tags=["Infographics"])
async def generate_from_text(
    request: TextRequest, authenticated: bool = Depends(authenticate)
):
    """Generate infographic component from text input"""
    try:
        result = builder.run_infographic(
            data=request.text,
            data_type=DataType.TEXT,
        )
        return result
    except Exception as e:
        logger.error(f"Error generating from text: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/gen-file/infographic", response_model=InfographicRemotionResponse, tags=["Infographics"])
async def generate_from_file(
    file: UploadFile = File(...),
    authenticated: bool = Depends(authenticate),
):
    """Generate infographic component from file input"""
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

        result = builder.run_infographic(
            data=data, data_type=data_type
        )
        return result
    except Exception as e:
        logger.error(f"Error generating from file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/gen-text/story", response_model=StoryRemotionResponse, tags=["Infographics Story"])
async def generate_story_from_text(
    request: TextRequest, authenticated: bool = Depends(authenticate)
):
    """Generate infographics story component from text input"""
    try:
        result = builder.run_story_remotion(
            data=request.text,
            data_type=DataType.TEXT,
        )
        return result
    except Exception as e:
        logger.error(f"Error generating from text: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/gen-file/story", response_model=StoryRemotionResponse, tags=["Infographics Story"])
async def generate_story_from_file(
    file: UploadFile = File(...),
    authenticated: bool = Depends(authenticate),
):
    """Generate infographics story component from file input"""
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

        result = builder.run_story_remotion(
            data=data, data_type=data_type
        )
        return result
    except Exception as e:
        logger.error(f"Error generating from file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/gen-text/code-remotion", response_model=CodeResponse, tags=["Remotion Code"])
async def generate_from_text_remotion(
    request: TextRequest, authenticated: bool = Depends(authenticate)
):
    """Generate code from text input"""
    try:
        result = builder.run_code_remotion(
            data=request.text,
            data_type=DataType.TEXT,
        )
        return CodeResponse(code=result)
    except Exception as e:
        logger.error(f"Error generating from text: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/gen-file/code-remotion", response_model=CodeResponse, tags=["Remotion Code"])
async def generate_from_file_remotion(
    file: UploadFile = File(...),
    authenticated: bool = Depends(authenticate),
):
    """Generate code from file input"""
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

        result = builder.run_code_remotion(
            data=data, data_type=data_type
        )
        return CodeResponse(code=result)
    except Exception as e:
        logger.error(f"Error generating from file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("fastapi_app:app", host="0.0.0.0", port=8000)
