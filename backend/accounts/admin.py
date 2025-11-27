from django.contrib import admin
from .models import User, OTP


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'role', 'is_email_verified', 'is_active', 'created_at')
    list_filter = ('role', 'is_email_verified', 'is_active')
    search_fields = ('email', 'name', 'username')
    readonly_fields = ('id', 'created_at', 'updated_at', 'last_login')


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ('email', 'purpose', 'is_used', 'expires_at', 'created_at')
    list_filter = ('purpose', 'is_used', 'expires_at')
    search_fields = ('email',)
    readonly_fields = ('id', 'otp_code', 'created_at')
    ordering = ('-created_at',)

