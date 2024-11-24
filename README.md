# Chanim
Chanim is an LLM-driven automated Infographics Generator from text or CSV data.

## Features

- Text or CSV data input
- Support for various chart types such as line, bar, column, pie.
- LLM automatically decides the best chart type for the data

## Installation

To set up the project, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/Tarun-Khilani/chanim.git
    cd chanim
    ```

2. Use `uv` to set up a virtual environment and install dependencies:
    ```sh
    uv sync
    ```

3. Install dependencies for Manim as per the [official documentation](https://docs.manim.community/en/stable/installation.html).
    - On Windows, using package manager `choco`:
        ```sh
        choco install miktex.install ffmpeg
        ```
    - On Linux:
        ```sh
        sudo apt install texlive texlive-latex-extra ffmpeg
        ```

4. Activate the virtual environment:
    - On Windows:
        ```sh
        venv\Scripts\activate
        ```
    - On macOS/Linux:
        ```sh
        source venv/bin/activate
        ```

## Usage

To run the project, activate the virtual environment and use the following command:
```sh
streamlit run app.py
```

## License

This project is licensed under the Apache 2.0 License. See the [LICENSE](LICENSE) file for details.

## Citations

```bibtex
@software{The_Manim_Community_Developers_Manim_Mathematical_2024,
author = {{The Manim Community Developers}},
license = {MIT},
month = apr,
title = {{Manim – Mathematical Animation Framework}},
url = {https://www.manim.community/},
version = {v0.18.1},
year = {2024}
}
```