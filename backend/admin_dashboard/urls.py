from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.dashboard_stats, name='dashboard_stats'),
    path('mood-metrics/', views.mood_metrics, name='mood_metrics'),
    path('feature-usage/', views.feature_usage, name='feature_usage'),
    path('risk-assessment/', views.risk_assessment, name='risk_assessment'),
    path('campus-distribution/', views.campus_distribution, name='campus_distribution'),
    path('resource-allocation/', views.resource_allocation, name='resource_allocation'),
    path('budget-optimization/', views.budget_optimization, name='budget_optimization'),
    path('high-impact-areas/', views.high_impact_areas, name='high_impact_areas'),
    path('integration-settings/', views.integration_settings, name='integration_settings'),
    path('integration-test/', views.test_integration, name='test_integration'),
    path('integration-status/', views.integration_status, name='integration_status'),
    path('counselors/', views.counselors_list, name='counselors_list'),
    path('students-requiring-counseling/', views.students_requiring_counseling, name='students_requiring_counseling'),
    path('chat-communications-log/', views.chat_communications_log, name='chat_communications_log'),
    path('assign-counselor/', views.assign_counselor, name='assign_counselor'),
]

