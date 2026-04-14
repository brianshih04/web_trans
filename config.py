import os
import sys
import logging
from datetime import datetime


logger = logging.getLogger("web_trans")


def setup_logging(debug: bool = False) -> None:
    level = logging.DEBUG if debug else logging.INFO
    logging.basicConfig(
        level=level,
        format="[%(asctime)s] %(levelname)s: %(message)s",
        datefmt="%H:%M:%S",
    )


def get_base_dir() -> str:
    if getattr(sys, "frozen", False):
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))


DEV_SERVER_URL = "http://localhost:5173"
DEFAULT_WIDTH = 900
DEFAULT_HEIGHT = 700
MIN_WIDTH = 600
MIN_HEIGHT = 500
WINDOW_TITLE = "即時語音轉文字"
