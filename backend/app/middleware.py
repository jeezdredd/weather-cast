import time
from collections import deque

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

profiler_data: deque[dict] = deque(maxlen=200)


class RequestProfilerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.time()
        response = await call_next(request)
        duration = round((time.time() - start) * 1000, 2)

        profiler_data.append({
            "method": request.method,
            "path": str(request.url.path),
            "status_code": response.status_code,
            "duration_ms": duration,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
        })

        return response
