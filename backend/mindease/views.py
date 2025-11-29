"""
Health check endpoint for deployment monitoring
"""
import logging
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

logger = logging.getLogger(__name__)


@csrf_exempt
@require_http_methods(["GET", "HEAD", "OPTIONS"])
def health_check(request):
    """
    Simple health check endpoint to verify backend is running.
    Bypasses all middleware and authentication for reliability.
    """
    try:
        logger.info(f"Health check accessed: {request.method} {request.path}")
        logger.info(f"Headers: {dict(request.headers)}")
        logger.info(f"Meta: {dict(request.META)}")
        
        response_data = {
            'status': 'ok',
            'message': 'MindEase API is running',
            'version': '1.0.0',
            'path': request.path,
            'method': request.method
        }
        
        return JsonResponse(response_data, json_dumps_params={'indent': 2})
    except Exception as e:
        logger.error(f"Error in health_check: {str(e)}", exc_info=True)
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

