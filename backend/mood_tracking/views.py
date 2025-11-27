from rest_framework import generics, permissions
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .models import MoodLog
from .serializers import MoodLogSerializer


class MoodLogListCreateView(generics.ListCreateAPIView):
    serializer_class = MoodLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MoodLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MoodLogStatsView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        days = int(request.query_params.get('days', 7))
        start_date = timezone.now() - timedelta(days=days)
        
        logs = MoodLog.objects.filter(
            user=request.user,
            created_at__gte=start_date
        ).order_by('created_at')
        
        if not logs.exists():
            return Response({
                'average_mood': 0,
                'total_logs': 0,
                'logs': []
            })
        
        scores = [log.mood_score for log in logs]
        average = sum(scores) / len(scores)
        
        return Response({
            'average_mood': round(average, 2),
            'total_logs': len(logs),
            'logs': MoodLogSerializer(logs, many=True).data
        })

