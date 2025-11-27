from rest_framework import serializers
from .models import MoodLog


class MoodLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodLog
        fields = ('id', 'mood_score', 'text_input', 'sentiment_label', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

