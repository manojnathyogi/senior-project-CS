"""
Health check endpoint for deployment monitoring
"""
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods


@csrf_exempt
@require_http_methods(["GET", "HEAD", "OPTIONS"])
def health_check(request):
    """
    Simple health check endpoint to verify backend is running.
    Bypasses all middleware and authentication for reliability.
    """
    return JsonResponse({
        'status': 'ok',
        'message': 'MindEase API is running',
        'version': '1.0.0'
    }, json_dumps_params={'indent': 2})

