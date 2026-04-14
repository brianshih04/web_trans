import os
import sys
import webview
from datetime import datetime


class Api:
    def __init__(self):
        self.output_dir = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), "output"
        )
        os.makedirs(self.output_dir, exist_ok=True)

    def receive_text(self, text):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {text}")
        self._append_to_file(text)

    def _append_to_file(self, text):
        date_str = datetime.now().strftime("%Y-%m-%d")
        filepath = os.path.join(self.output_dir, f"{date_str}.txt")
        with open(filepath, "a", encoding="utf-8") as f:
            f.write(text + "\n")


DEV_SERVER_URL = "http://localhost:5173"


def get_frontend_url():
    if getattr(sys, "frozen", False):
        base_path = sys._MEIPASS
    else:
        base_path = os.path.dirname(os.path.abspath(__file__))

    dist_path = os.path.join(base_path, "frontend", "dist", "index.html")
    if os.path.exists(dist_path):
        return dist_path

    return DEV_SERVER_URL


if __name__ == "__main__":
    api = Api()
    url = get_frontend_url()
    window = webview.create_window(
        "即時語音轉文字",
        url,
        js_api=api,
        width=900,
        height=700,
        resizable=True,
        min_size=(600, 500),
    )
    webview.start(debug="--debug" in sys.argv)
