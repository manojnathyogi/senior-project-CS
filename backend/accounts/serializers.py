from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User

# Allowed email domains
ALLOWED_EMAIL_DOMAINS = ['@bison.howard.edu', '@howard.edu']


def validate_howard_email(value):
    """Validate that email is from Howard University"""
    email_domain = '@' + value.split('@')[1] if '@' in value else ''
    if email_domain not in ALLOWED_EMAIL_DOMAINS:
        raise serializers.ValidationError(
            f"Email must be from Howard University. Allowed domains: {', '.join(ALLOWED_EMAIL_DOMAINS)}"
        )
    return value


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(validators=[validate_howard_email])
    
    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'username', 'university', 'role', 'is_email_verified', 'created_at')
        read_only_fields = ('id', 'is_email_verified', 'created_at')


class UserRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(validators=[validate_howard_email])
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'password_confirm', 'name', 'username', 'university', 'role')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, validators=[validate_howard_email])


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs


class OTPRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, validators=[validate_howard_email])
    purpose = serializers.ChoiceField(
        choices=['login', 'signup', 'password_reset'],
        default='login',
        required=False
    )


class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, validators=[validate_howard_email])
    otp_code = serializers.CharField(
        required=True,
        min_length=6,
        max_length=6,
        help_text="6-digit OTP code"
    )
    
    def validate_otp_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("OTP code must contain only digits")
        if len(value) != 6:
            raise serializers.ValidationError("OTP code must be 6 digits")
        return value

