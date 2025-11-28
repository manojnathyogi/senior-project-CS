"""
Health check endpoint for deployment monitoring
"""
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods


@require_http_methods(["GET"])
def health_check(request):
    """
    Simple health check endpoint to verify backend is running.
    """
    return JsonResponse({
        'status': 'ok',
        'message': 'MindEase API is running',
        'version': '1.0.0'
    })

