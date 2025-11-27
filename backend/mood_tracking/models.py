from django.db import models
from accounts.models import User
import uuid


class MoodLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mood_logs')
    mood_score = models.IntegerField()
    text_input = models.TextField(null=True, blank=True)
    sentiment_label = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'mood_logs'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.mood_score} - {self.created_at}"

