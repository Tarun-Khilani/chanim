import functools
import time

from src.logger import setup_logger

logger = setup_logger(__name__)


def timeit(func):
    """Time a function."""

    @functools.wraps(func)
    def wrapper(self, *args, **kwargs):
        t1 = time.time()
        result = func(self, *args, **kwargs)
        t2 = time.time()
        logger.info(f"Function {func.__name__!r} executed in {(t2 - t1):.4f}s")
        return result

    return wrapper
