from django.urls import path
from . import views

urlpatterns = [
    # Traditional authentication
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('verify-email/', views.verify_email, name='verify_email'),
    path('password-reset/', views.password_reset, name='password_reset'),
    path('password-reset-confirm/', views.password_reset_confirm, name='password_reset_confirm'),
    
    # OTP-based authentication
    path('otp/request/', views.request_otp, name='request_otp'),
    path('otp/verify-login/', views.verify_otp_login, name='verify_otp_login'),
    path('otp/verify-signup/', views.verify_otp_signup, name='verify_otp_signup'),
    
    # Profile
    path('profile/', views.profile, name='profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
    
    # Admin only
    path('users/', views.list_users, name='list_users'),
    path('create-counselor/', views.create_counselor, name='create_counselor'),
    path('users/<uuid:user_id>/delete/', views.delete_user, name='delete_user'),
    path('delete-user/', views.delete_user, name='delete_user_by_email'),
]

