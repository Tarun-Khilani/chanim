import logging
from datetime import datetime
from pathlib import Path

from app.config import Config

def setup_logger(name: str) -> logging.Logger:
    """Set up a logger with both file and stream handlers."""
    logger = logging.getLogger(name)
    logger.setLevel(Config.LOG_LEVEL)

    # Create formatters
    file_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    stream_formatter = logging.Formatter(
        '%(levelname)s - %(message)s'
    )

    # Create and set up file handler
    logs_dir = Path("logs")
    logs_dir.mkdir(exist_ok=True)
    
    file_handler = logging.FileHandler(
        logs_dir / f"chanim_{datetime.now().strftime('%Y%m%d')}.log"
    )
    file_handler.setLevel(Config.LOG_LEVEL)
    file_handler.setFormatter(file_formatter)

    # Create and set up stream handler
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(Config.LOG_LEVEL)
    stream_handler.setFormatter(stream_formatter)

    # Add handlers to logger
    logger.addHandler(file_handler)
    logger.addHandler(stream_handler)

    return logger
