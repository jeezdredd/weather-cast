import time
from collections import deque

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

profiler_data: deque[dict] = deque(maxlen=200)


class RequestProfilerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.time()
        try:
            response = await call_next(request)
        except Exception:
            response = Response(status_code=500)
        duration = round((time.time() - start) * 1000, 2)

        profiler_data.append({
            "method": request.method,
            "path": str(request.url.path),
            "status_code": response.status_code,
            "duration_ms": duration,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
        })

        return response
