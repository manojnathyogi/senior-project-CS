"""
Health check endpoint for deployment monitoring
"""
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
@require_http_methods(["GET", "HEAD"])
def health_check(request):
    """
    Simple health check endpoint to verify backend is running.
    """
    return JsonResponse({
        'status': 'ok',
        'message': 'MindEase API is running',
        'version': '1.0.0'
    })

