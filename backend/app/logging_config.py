import asyncio
import logging
import sys
from collections import deque
from datetime import UTC, datetime

from app.config import settings

log_buffer: deque[dict] = deque(maxlen=500)
log_subscribers: set[asyncio.Queue] = set()


class MemoryLogHandler(logging.Handler):
    def emit(self, record):
        entry = {
            "timestamp": datetime.fromtimestamp(record.created, tz=UTC).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        log_buffer.append(entry)
        for queue in list(log_subscribers):
            try:
                queue.put_nowait(entry)
            except Exception:
                pass


memory_handler = MemoryLogHandler()


def setup_logging() -> None:
    logging.basicConfig(
        level=getattr(logging, settings.log_level.upper(), logging.INFO),
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[logging.StreamHandler(sys.stdout), memory_handler],
    )
