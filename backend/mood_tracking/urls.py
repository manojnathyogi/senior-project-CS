from django.urls import path
from . import views

urlpatterns = [
    path('', views.MoodLogListCreateView.as_view(), name='mood_log_list_create'),
    path('stats/', views.MoodLogStatsView.as_view(), name='mood_log_stats'),
]

