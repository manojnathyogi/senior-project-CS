from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
import secrets
import hashlib

from .models import User, OTP
from .serializers import UserSerializer, UserRegistrationSerializer, PasswordResetSerializer, PasswordResetConfirmSerializer, OTPRequestSerializer, OTPVerifySerializer


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        # Email validation is handled by serializer
        user = serializer.save()
        
        # Generate email verification token
        token = secrets.token_urlsafe(32)
        user.email_verification_token = hashlib.sha256(token.encode()).hexdigest()
        user.save()
        
        # Send verification email
        verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}&email={user.email}"
        send_mail(
            subject='Verify your MindEase account',
            message=f'Click this link to verify your email: {verification_url}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        
        return Response({
            'message': 'Registration successful. Please check your email to verify your account.',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Validate Howard University email ONLY for students
    if user.role == 'student':
        email_domain = '@' + email.split('@')[1] if '@' in email else ''
        allowed_domains = ['@bison.howard.edu', '@howard.edu']
        if email_domain not in allowed_domains:
            return Response({
                'error': f'Email must be from Howard University. Allowed domains: {", ".join(allowed_domains)}'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    if not user.is_active:
        return Response({'error': 'Account is disabled'}, status=status.HTTP_403_FORBIDDEN)
    
    # Check if user has a password set
    if not user.has_usable_password():
        return Response({
            'error': 'This account was created with OTP only. Please use "Login with OTP Code" instead.'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    if not user.check_password(password):
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Update last login
    user.last_login = timezone.now()
    user.save()
    
    tokens = get_tokens_for_user(user)
    return Response({
        'access': tokens['access'],
        'refresh': tokens['refresh'],
        'user': UserSerializer(user).data
    })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_email(request):
    token = request.data.get('token')
    email = request.data.get('email')
    
    if not token or not email:
        return Response({'error': 'Token and email are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        
        if user.email_verification_token == token_hash:
            user.is_email_verified = True
            user.email_verification_token = None
            user.save()
            return Response({'message': 'Email verified successfully'})
        else:
            return Response({'error': 'Invalid verification token'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset(request):
    serializer = PasswordResetSerializer(data=request.data)
    if serializer.is_valid():
        # Email validation is handled by serializer
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
            token = secrets.token_urlsafe(32)
            user.password_reset_token = hashlib.sha256(token.encode()).hexdigest()
            user.password_reset_expires = timezone.now() + timezone.timedelta(hours=1)
            user.save()
            
            reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}&email={user.email}"
            send_mail(
                subject='Reset your MindEase password',
                message=f'Click this link to reset your password: {reset_url}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
            
            return Response({'message': 'Password reset email sent'})
        except User.DoesNotExist:
            # Don't reveal if email exists
            return Response({'message': 'Password reset email sent'})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_confirm(request):
    serializer = PasswordResetConfirmSerializer(data=request.data)
    if serializer.is_valid():
        token = serializer.validated_data['token']
        email = request.data.get('email')
        
        try:
            user = User.objects.get(email=email)
            token_hash = hashlib.sha256(token.encode()).hexdigest()
            
            if (user.password_reset_token == token_hash and 
                user.password_reset_expires and 
                user.password_reset_expires > timezone.now()):
                user.set_password(serializer.validated_data['password'])
                user.password_reset_token = None
                user.password_reset_expires = None
                user.save()
                return Response({'message': 'Password reset successfully'})
            else:
                return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_profile(request):
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def list_users(request):
    """List all users - Admin only"""
    # Check if user is admin
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    users = User.objects.all().order_by('-created_at')
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_counselor(request):
    """Create a counselor account - Admin only"""
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    email = request.data.get('email')
    name = request.data.get('name')
    password = request.data.get('password')
    university = request.data.get('university', '')
    username = request.data.get('username')
    
    if not email or not name or not password:
        return Response({
            'error': 'Email, name, and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if user already exists
    if User.objects.filter(email=email).exists():
        return Response({
            'error': 'User with this email already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate password length
    if len(password) < 6:
        return Response({
            'error': 'Password must be at least 6 characters'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Create counselor account
        counselor = User.objects.create_user(
            email=email,
            password=password,
            name=name,
            username=username,
            university=university,
            role='counselor',
            is_email_verified=True  # Admin-created accounts are pre-verified
        )
        
        return Response({
            'message': 'Counselor account created successfully',
            'user': UserSerializer(counselor).data
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({
            'error': f'Failed to create counselor account: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_user(request, user_id=None):
    """Delete a user account - Admin only"""
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    # Get user_id from URL or request body
    if not user_id:
        user_id = request.data.get('user_id') or request.query_params.get('user_id')
    
    if not user_id:
        return Response({
            'error': 'User ID is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user_to_delete = User.objects.get(id=user_id)
        
        # Prevent deleting yourself
        if user_to_delete.id == request.user.id:
            return Response({
                'error': 'You cannot delete your own account'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Store email for response
        user_email = user_to_delete.email
        
        # Delete the user
        user_to_delete.delete()
        
        return Response({
            'message': f'User {user_email} has been deleted successfully'
        }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': f'Failed to delete user: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def request_otp(request):
    """Request OTP for login/signup"""
    serializer = OTPRequestSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        purpose = serializer.validated_data.get('purpose', 'login')
        
        # Email validation is handled by serializer, but double-check here
        email_domain = '@' + email.split('@')[1] if '@' in email else ''
        allowed_domains = ['@bison.howard.edu', '@howard.edu']
        if email_domain not in allowed_domains:
            return Response({
                'error': f'Email must be from Howard University. Allowed domains: {", ".join(allowed_domains)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Clean up expired OTPs
        OTP.cleanup_expired()
        
        # Generate OTP
        otp_record, otp_code = OTP.generate_otp(email, purpose=purpose, expiry_minutes=10)
        
        # Send OTP via email
        try:
            subject = 'Your MindEase Verification Code'
            if purpose == 'login':
                message = f'Your login verification code is: {otp_code}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this code, please ignore this email.'
            elif purpose == 'signup':
                message = f'Your signup verification code is: {otp_code}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this code, please ignore this email.'
            else:
                message = f'Your verification code is: {otp_code}\n\nThis code will expire in 10 minutes.'
            
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
            
            return Response({
                'message': f'OTP sent to {email}',
                'expires_in': 600  # 10 minutes in seconds
            }, status=status.HTTP_200_OK)
        except Exception as e:
            # Delete OTP if email fails
            otp_record.delete()
            return Response({
                'error': 'Failed to send OTP email. Please check your email configuration.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_otp_login(request):
    """Verify OTP and login user"""
    serializer = OTPVerifySerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        otp_code = serializer.validated_data['otp_code']
        
        # Verify OTP
        is_valid, otp_record = OTP.verify_otp(email, otp_code, purpose='login')
        
        if not is_valid:
            return Response({
                'error': 'Invalid or expired OTP code'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get or create user
        try:
            user = User.objects.get(email=email)
            if not user.is_active:
                return Response({
                    'error': 'Account is disabled'
                }, status=status.HTTP_403_FORBIDDEN)
        except User.DoesNotExist:
            # For signup flow, create user
            name = request.data.get('name', email.split('@')[0])
            university = request.data.get('university')
            role = request.data.get('role', 'student')
            
            user = User.objects.create_user(
                email=email,
                password=None,  # No password for OTP-only auth
                name=name,
                university=university,
                role=role,
                is_email_verified=True  # OTP verification counts as email verification
            )
        
        # Update last login
        user.last_login = timezone.now()
        user.save()
        
        # Generate JWT tokens
        tokens = get_tokens_for_user(user)
        
        return Response({
            'access': tokens['access'],
            'refresh': tokens['refresh'],
            'user': UserSerializer(user).data,
            'message': 'Login successful'
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_otp_signup(request):
    """Verify OTP for signup"""
    serializer = OTPVerifySerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        otp_code = serializer.validated_data['otp_code']
        
        # Verify OTP
        is_valid, otp_record = OTP.verify_otp(email, otp_code, purpose='signup')
        
        if not is_valid:
            return Response({
                'error': 'Invalid or expired OTP code'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response({
                'error': 'User with this email already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user
        name = request.data.get('name', email.split('@')[0])
        username = request.data.get('username')
        university = request.data.get('university')
        role = request.data.get('role', 'student')
        password = request.data.get('password')
        
        # Password is required for signup (OTP is only for email verification)
        if not password:
            return Response({
                'error': 'Password is required for signup'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate password length
        if len(password) < 6:
            return Response({
                'error': 'Password must be at least 6 characters'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(
            email=email,
            password=password,  # Set password for login
            name=name,
            username=username,
            university=university,
            role=role,
            is_email_verified=True
        )
        
        # Generate JWT tokens
        tokens = get_tokens_for_user(user)
        
        return Response({
            'access': tokens['access'],
            'refresh': tokens['refresh'],
            'user': UserSerializer(user).data,
            'message': 'Account created successfully'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

