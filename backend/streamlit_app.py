import pandas as pd
import streamlit as st

from app.builder import Builder
from app.config import QUALITY_MAPPING
from app.enums import DataType, VideoQuality
from app.logger import setup_logger
from dotenv import load_dotenv

load_dotenv()

logger = setup_logger(__name__)

# Initialize session state
if "builder" not in st.session_state:
    st.session_state["builder"] = Builder()
if "current_input" not in st.session_state:
    st.session_state["current_input"] = ""
if "current_dtype" not in st.session_state:
    st.session_state["current_dtype"] = ""
if "result" not in st.session_state:
    st.session_state["result"] = None

# Set page config
st.set_page_config(
    page_title="Chanim", page_icon=":chart_with_upwards_trend:", layout="centered"
)
st.image("app/public/logo.jpeg", use_container_width=True)
st.title("Dynamic Infographics Generator")


# Input section
st.header("Input Data")

# Text/File upload toggle
input_method = st.radio("Choose Input Method", ["Text Input", "File Upload"])
video_quality = st.radio("Select Video Quality", ["LOW", "MEDIUM"], index=1)
user_input_provided = False

if input_method == "Text Input":
    user_input = st.text_area("Enter your text", height=100)
    st.session_state["current_dtype"] = DataType.TEXT
    user_input_provided = True
else:  # File Upload
    uploaded_file = st.file_uploader("Upload a file", type=["csv", "txt"])
    if uploaded_file is not None:
        file_extension = uploaded_file.name.split(".")[-1].lower()

        try:
            if file_extension == "csv":
                # Read CSV file
                df = pd.read_csv(uploaded_file)
                user_input = df
                st.session_state["current_dtype"] = DataType.CSV
                user_input_provided = True
                logger.debug(f"Successfully loaded CSV file: {uploaded_file.name}")
            else:
                # Read text file
                user_input = uploaded_file.getvalue().decode("utf-8")
                st.session_state["current_dtype"] = DataType.TEXT
                user_input_provided = True
                logger.debug(f"Successfully loaded text file: {uploaded_file.name}")

        except Exception as e:
            error_msg = f"Error reading file {uploaded_file.name}: {str(e)}"
            logger.error(error_msg)
            st.error("Error reading file")

# Process button
if st.button("Process Data"):
    if user_input_provided:
        st.session_state["current_input"] = user_input
        logger.debug("Data processed and stored in session state")
        st.success("Data processed successfully!")
    else:
        logger.warning("Process attempt without input data")
        st.warning("Please provide input data first!")

# Generation
if st.button("Generate") and user_input_provided:
    logger.debug("Starting Generation")
    with st.spinner("Generating ..."):
        try:
            st.session_state["result"] = st.session_state["builder"].run(
                st.session_state["current_input"],
                st.session_state["current_dtype"],
                VideoQuality[video_quality],
            )
            logger.debug("Generation successful")
            st.success("Generation Successful!")
        except Exception as e:
            error_msg = f"Generation failed: {str(e)}"
            logger.error(error_msg)
            st.session_state["result"] = None
            st.error("Internal error occurred! Please try again.")

if st.session_state["result"]:
    st.header("Infographics")
    try:
        quality = QUALITY_MAPPING[VideoQuality[video_quality]]
        video_path = f'media/videos/{quality}/{st.session_state["result"]}.mp4'
        with open(video_path, "rb") as f:
            video_bytes = f.read()
        st.video(video_bytes, loop=True, autoplay=True)
        logger.debug(f"Successfully loaded and displayed video: {video_path}")
    except Exception as e:
        error_msg = f"Error loading video file: {str(e)}"
        logger.error(error_msg)
        st.error("Error displaying video")
