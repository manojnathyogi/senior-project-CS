"""
Health check endpoint for deployment monitoring
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['GET', 'HEAD'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Simple health check endpoint to verify backend is running.
    """
    return Response({
        'status': 'ok',
        'message': 'MindEase API is running',
        'version': '1.0.0'
    })

