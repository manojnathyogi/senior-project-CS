from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from datetime import timedelta
import uuid
import secrets
import hashlib


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            # For OTP-only authentication, set an unusable password
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)
    university = models.CharField(max_length=255, null=True, blank=True)
    role = models.CharField(
        max_length=20,
        choices=[('student', 'Student'), ('admin', 'Admin'), ('counselor', 'Counselor')],
        default='student'
    )
    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=255, null=True, blank=True)
    password_reset_token = models.CharField(max_length=255, null=True, blank=True)
    password_reset_expires = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.email


class OTP(models.Model):
    """One-Time Password for email-based authentication"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField()
    otp_code = models.CharField(max_length=64)  # Stored as SHA256 hash (64 chars)
    purpose = models.CharField(
        max_length=20,
        choices=[
            ('login', 'Login'),
            ('signup', 'Sign Up'),
            ('password_reset', 'Password Reset'),
        ],
        default='login'
    )
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'otps'
        indexes = [
            models.Index(fields=['email', 'purpose', 'is_used']),
            models.Index(fields=['expires_at']),
        ]

    def __str__(self):
        return f"OTP for {self.email} - {self.purpose}"

    @classmethod
    def generate_otp(cls, email, purpose='login', expiry_minutes=10):
        """Generate a new OTP for the given email"""
        # Generate 6-digit OTP
        otp_code = ''.join([str(secrets.randbelow(10)) for _ in range(6)])
        
        # Hash the OTP for storage
        otp_hash = hashlib.sha256(otp_code.encode()).hexdigest()
        
        # Create OTP record
        otp = cls.objects.create(
            email=email,
            otp_code=otp_hash,
            purpose=purpose,
            expires_at=timezone.now() + timedelta(minutes=expiry_minutes)
        )
        
        return otp, otp_code  # Return both the record and plain code

    @classmethod
    def verify_otp(cls, email, otp_code, purpose='login'):
        """Verify an OTP code"""
        otp_hash = hashlib.sha256(otp_code.encode()).hexdigest()
        
        try:
            otp = cls.objects.get(
                email=email,
                otp_code=otp_hash,
                purpose=purpose,
                is_used=False,
                expires_at__gt=timezone.now()
            )
            otp.is_used = True
            otp.save()
            return True, otp
        except cls.DoesNotExist:
            return False, None

    @classmethod
    def cleanup_expired(cls):
        """Clean up expired OTPs"""
        cls.objects.filter(expires_at__lt=timezone.now()).delete()

