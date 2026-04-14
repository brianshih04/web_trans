import os
import logging
from datetime import datetime

from config import get_base_dir

logger = logging.getLogger("web_trans")


class Api:
    def __init__(self) -> None:
        self.output_dir = os.path.join(get_base_dir(), "output")
        os.makedirs(self.output_dir, exist_ok=True)
        logger.info("Output directory: %s", self.output_dir)

    def receive_text(self, text: str) -> None:
        timestamp = datetime.now().strftime("%H:%M:%S")
        logger.info("[%s] %s", timestamp, text)
        self._append_to_file(text)

    def _append_to_file(self, text: str) -> None:
        date_str = datetime.now().strftime("%Y-%m-%d")
        filepath = os.path.join(self.output_dir, f"{date_str}.txt")
        with open(filepath, "a", encoding="utf-8") as f:
            f.write(text + "\n")
            f.flush()
