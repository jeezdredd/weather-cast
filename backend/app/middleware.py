import logging
import time
from collections import deque

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

logger = logging.getLogger(__name__)

profiler_data: deque[dict] = deque(maxlen=200)


class RequestProfilerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.time()
        try:
            response = await call_next(request)
        except Exception as exc:
            logger.exception("Unhandled error on %s %s", request.method, request.url.path)
            response = JSONResponse(
                status_code=500,
                content={"detail": str(exc)},
            )
        duration = round((time.time() - start) * 1000, 2)

        profiler_data.append({
            "method": request.method,
            "path": str(request.url.path),
            "status_code": response.status_code,
            "duration_ms": duration,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
        })

        return response
