import os
import sys
import webview

from api import Api
from config import (
    DEV_SERVER_URL,
    setup_logging,
    get_base_dir,
    WINDOW_TITLE,
    DEFAULT_WIDTH,
    DEFAULT_HEIGHT,
    MIN_WIDTH,
    MIN_HEIGHT,
)


def get_frontend_url() -> str:
    if getattr(sys, "frozen", False):
        base_path = sys._MEIPASS
    else:
        base_path = get_base_dir()

    dist_path = os.path.join(base_path, "frontend", "dist", "index.html")
    if os.path.exists(dist_path):
        return dist_path

    return DEV_SERVER_URL


if __name__ == "__main__":
    debug = "--debug" in sys.argv
    setup_logging(debug)

    api = Api()
    url = get_frontend_url()
    window = webview.create_window(
        WINDOW_TITLE,
        url,
        js_api=api,
        width=DEFAULT_WIDTH,
        height=DEFAULT_HEIGHT,
        resizable=True,
        min_size=(MIN_WIDTH, MIN_HEIGHT),
    )
    webview.start(debug=debug)
