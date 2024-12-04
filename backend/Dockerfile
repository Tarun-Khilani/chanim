FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

WORKDIR /app

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Copy from the cache instead of linking since it's a mounted volume
ENV UV_LINK_MODE=copy

# Install system dependencies, uv, and packages from packages.txt
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    python3-dev \
    libcairo2-dev \
    libpango1.0-dev \
    texlive \
    texlive-latex-extra \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

ENV UV_SYSTEM_PYTHON=true

ADD . /app
RUN uv pip install -r /app/requirements.txt

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"

# Reset the entrypoint, don't invoke `uv`
ENTRYPOINT []

# Run the application
CMD ["python3", "fastapi_app.py"]