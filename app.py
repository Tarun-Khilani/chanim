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
if "chart" not in st.session_state:
    st.session_state["chart"] = None

builder = Builder()

# Set page config
st.set_page_config(
    page_title="Chart Gen", page_icon=":chart_with_upwards_trend:", layout="wide"
)
st.title("Chart Gen")


# Input section
st.header("Input Data")

# Text/File upload toggle
input_method = st.radio("Choose input method:", ["Text Input", "File Upload"])

user_input_provided = False

if input_method == "Text Input":
    user_input = st.text_area("Enter your text data:", height=200)
    st.session_state["current_dtype"] = "text"
    user_input_provided = True
else:  # File Upload
    uploaded_file = st.file_uploader("Upload a file", type=['csv', 'txt'])
    if uploaded_file is not None:
        file_extension = uploaded_file.name.split('.')[-1].lower()
        
        try:
            if file_extension == 'csv':
                # Read CSV file
                df = pd.read_csv(uploaded_file)
                user_input = df
                st.session_state["current_dtype"] = "csv"
                user_input_provided = True
                st.success("CSV file uploaded successfully!")
            else:  # txt file
                # Read text file
                user_input = uploaded_file.getvalue().decode("utf-8")
                st.session_state["current_dtype"] = "text"
                user_input_provided = True
                st.success("Text file uploaded successfully!")
                
        except Exception as e:
            st.error(f"Error reading file: {str(e)}")

# Process button
if st.button("Process Data"):
    if user_input_provided:
        st.session_state["current_input"] = user_input
        st.success("Data processed successfully!")
    else:
        st.warning("Please provide input data first!")

# Chart generation
if st.button("Generate Chart") and user_input_provided:
    with st.spinner("Generating chart..."):
        st.session_state["chart"] = builder.run(st.session_state["current_input"], st.session_state["current_dtype"])
        st.success("Chart generated successfully!")

if st.session_state["chart"]:
    st.header("Chart")
    components.html(st.session_state["chart"], height=600, width=1000)