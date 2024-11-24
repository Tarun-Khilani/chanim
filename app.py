import pandas as pd
import streamlit as st
import streamlit.components.v1 as components
from dotenv import load_dotenv

from src.builder import Builder

load_dotenv()

# Initialize session state
if "current_input" not in st.session_state:
    st.session_state["current_input"] = ""
if "current_dtype" not in st.session_state:
    st.session_state["current_dtype"] = ""
if "current_chart_type" not in st.session_state:
    st.session_state["current_chart_type"] = ""
if "chart" not in st.session_state:
    st.session_state["chart"] = None

builder = Builder()

# Set page config
st.set_page_config(
    page_title="Chanim", page_icon=":chart_with_upwards_trend:", layout="centered"
)
st.image("public/logo.jpeg", use_container_width=True)
st.title("Dynamic Infographics Generator")


# Input section
st.header("Input Data")

# Text/File upload toggle
input_method = st.radio("Choose Input Method", ["Text Input", "File Upload"])
use_advanced_mode = st.checkbox("Use Advanced Mode", value=True)
user_input_provided = False

if input_method == "Text Input":
    user_input = st.text_area("Enter your text", height=100)
    st.session_state["current_dtype"] = "text"
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
                st.session_state["current_dtype"] = "csv"
                user_input_provided = True
            else:
                # Read text file
                user_input = uploaded_file.getvalue().decode("utf-8")
                st.session_state["current_dtype"] = "text"
                user_input_provided = True

        except Exception:
            st.error("Error reading file")

# # Optionally ask for chart type
# if user_input_provided:
#     if use_advanced_mode:
#         options = ["none", "line", "bar", "pie"]
#     else:
#         options = [
#             "none",
#             "bar",
#             "column",
#             "pie",
#             "stacked_bar",
#             "stacked_column",
#             "grouped_column",
#             "grouped_bar",
#             "heatmap",
#         ]
#     chart_type = st.selectbox(
#         "Select Chart Type (Optional)",
#         options,
#     )
#     st.session_state["current_chart_type"] = (
#         chart_type if chart_type != "none" else None
#     )

# Process button
if st.button("Process Data"):
    if user_input_provided:
        st.session_state["current_input"] = user_input
        st.success("Data processed successfully!")
    else:
        st.warning("Please provide input data first!")

# Chart generation
if st.button("Generate") and user_input_provided:
    with st.spinner("Generating ..."):
        try:
            st.session_state["chart"] = builder.run(
                st.session_state["current_input"],
                st.session_state["current_dtype"],
                None,
                use_advanced_mode,
            )
            st.success("Generation Successful!")
        except Exception:
            st.session_state["chart"] = None
            st.error("Internal error occurred! Please try again.")

if st.session_state["chart"]:
    st.header("Infographics")
    if not use_advanced_mode:
        components.html(st.session_state["chart"], height=600, width=1000)
    else:
        with open(f'media/videos/720p30/{st.session_state["chart"]}.mp4', "rb") as f:
            video_bytes = f.read()
        st.video(video_bytes, loop=True, autoplay=True)
