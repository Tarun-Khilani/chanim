# Chanim

Chanim is a LLM driven automated Chart Generator from text or CSV data.

## Features

- Text or CSV data input
- Support for various chart types such as bar, column, pie, stacked bar, stacked column, grouped column, grouped bar, heatmap
- LLM automatically decides the best chart type for the data

## Installation

To set up the project, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/Tarun-Khilani/chanim.git
    cd chanim
    ```

2. Use `uv` to set up virtual environment and install dependencies:
    ```sh
    uv sync
    ```

3. Activate the virtual environment:
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

