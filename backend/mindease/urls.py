"""
URL configuration for mindease project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('', views.health_check, name='root'),  # Root path handler
    path('admin/', admin.site.urls),
    path('api/health/', views.health_check, name='health_check'),
    path('api/', views.health_check, name='api_root'),  # Root API endpoint
    path('api/auth/', include('accounts.urls')),
    path('api/mood/', include('mood_tracking.urls')),
    path('api/journals/', include('journals.urls')),
    path('api/cbt/', include('cbt.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/assessments/', include('assessments.urls')),
    path('api/admin/', include('admin_dashboard.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

