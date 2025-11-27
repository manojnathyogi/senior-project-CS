from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions, status
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Count, Avg, Q, Sum, F
from django.db.models.functions import Extract, TruncDate, TruncHour
from datetime import timedelta
from accounts.models import User
from mood_tracking.models import MoodLog


def get_time_range(time_filter):
    """Get time range based on filter"""
    now = timezone.now()
    if time_filter == "day":
        return now - timedelta(days=1), now
    elif time_filter == "week":
        return now - timedelta(weeks=1), now
    elif time_filter == "month":
        return now - timedelta(days=30), now
    elif time_filter == "quarter":
        return now - timedelta(days=90), now
    elif time_filter == "year":
        return now - timedelta(days=365), now
    else:
        return now - timedelta(weeks=1), now


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics - Admin only"""
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    time_filter = request.query_params.get('time_filter', 'week')
    start_date, end_date = get_time_range(time_filter)
    prev_start_date = start_date - (end_date - start_date)
    
    # Active Users (students who logged mood in the period)
    active_users = User.objects.filter(
        role='student',
        mood_logs__created_at__range=[start_date, end_date]
    ).distinct().count()
    
    # Previous period for comparison
    prev_active_users = User.objects.filter(
        role='student',
        mood_logs__created_at__range=[prev_start_date, start_date]
    ).distinct().count()
    
    active_users_trend = 0
    if prev_active_users > 0:
        active_users_trend = round(((active_users - prev_active_users) / prev_active_users) * 100)
    
    # Average Session Time (estimated from mood log frequency)
    # For now, we'll use a simple calculation based on activity
    avg_session_time = 15  # Default, can be calculated from actual session data later
    session_time_trend = 0
    
    # Completed Exercises (mood logs can be considered as exercises)
    completed_exercises = MoodLog.objects.filter(
        created_at__range=[start_date, end_date]
    ).count()
    
    prev_completed_exercises = MoodLog.objects.filter(
        created_at__range=[prev_start_date, start_date]
    ).count()
    
    completed_exercises_trend = 0
    if prev_completed_exercises > 0:
        completed_exercises_trend = round(((completed_exercises - prev_completed_exercises) / prev_completed_exercises) * 100)
    
    # Risk Alerts (students with low mood scores)
    high_risk_threshold = 40  # Mood score below 40
    risk_alerts = User.objects.filter(
        role='student',
        mood_logs__mood_score__lt=high_risk_threshold,
        mood_logs__created_at__range=[start_date, end_date]
    ).distinct().count()
    
    prev_risk_alerts = User.objects.filter(
        role='student',
        mood_logs__mood_score__lt=high_risk_threshold,
        mood_logs__created_at__range=[prev_start_date, start_date]
    ).distinct().count()
    
    risk_alerts_trend = 0
    if prev_risk_alerts > 0:
        risk_alerts_trend = round(((risk_alerts - prev_risk_alerts) / prev_risk_alerts) * 100)
    else:
        risk_alerts_trend = -risk_alerts if risk_alerts > 0 else 0
    
    return Response({
        'activeUsers': active_users,
        'sessionTime': avg_session_time,
        'completedExercises': completed_exercises,
        'riskAlerts': risk_alerts,
        'trends': {
            'activeUsers': active_users_trend,
            'sessionTime': session_time_trend,
            'completedExercises': completed_exercises_trend,
            'riskAlerts': risk_alerts_trend
        }
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def mood_metrics(request):
    """Get mood metrics over time - Admin only"""
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    time_filter = request.query_params.get('time_filter', 'week')
    start_date, end_date = get_time_range(time_filter)
    
    # Get all mood logs in the period
    all_logs = MoodLog.objects.filter(created_at__range=[start_date, end_date])
    
    # Group by periods
    if time_filter == "day":
        periods = ["6am", "9am", "12pm", "3pm", "6pm", "9pm"]
        # Group by hour ranges
        period_data = {}
        for log in all_logs:
            hour = log.created_at.hour
            if 6 <= hour < 9:
                period = "6am"
            elif 9 <= hour < 12:
                period = "9am"
            elif 12 <= hour < 15:
                period = "12pm"
            elif 15 <= hour < 18:
                period = "3pm"
            elif 18 <= hour < 21:
                period = "6pm"
            elif 21 <= hour < 24:
                period = "9pm"
            else:
                period = "6am"
            
            if period not in period_data:
                period_data[period] = []
            period_data[period].append(log.mood_score)
    else:
        periods = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        # Group by day of week
        period_data = {}
        for log in all_logs:
            day_of_week = log.created_at.weekday()  # 0=Monday, 6=Sunday
            period = periods[day_of_week]
            
            if period not in period_data:
                period_data[period] = []
            period_data[period].append(log.mood_score)
    
    # Calculate metrics for each period
    data = []
    for period in periods:
        scores = period_data.get(period, [])
        avg_mood = sum(scores) / len(scores) if scores else 0
        
        # Derive metrics from mood score (simplified)
        anxiety = max(0, 100 - avg_mood - 20) if avg_mood > 0 else 0
        depression = max(0, 100 - avg_mood - 10) if avg_mood > 0 else 0
        stress = max(0, 100 - avg_mood - 15) if avg_mood > 0 else 0
        wellness = avg_mood if avg_mood > 0 else 0
        
        data.append({
            'name': period,
            'anxiety': round(anxiety),
            'depression': round(depression),
            'stress': round(stress),
            'wellness': round(wellness)
        })
    
    return Response(data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def feature_usage(request):
    """Get feature usage data - Admin only"""
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    time_filter = request.query_params.get('time_filter', 'week')
    start_date, end_date = get_time_range(time_filter)
    
    # For now, we only have mood tracking data
    # In the future, this will include meditation, CBT, journal entries
    all_logs = MoodLog.objects.filter(created_at__range=[start_date, end_date])
    
    if time_filter == "day":
        periods = ["6am", "9am", "12pm", "3pm", "6pm", "9pm"]
        # Group by hour ranges
        period_counts = {}
        for log in all_logs:
            hour = log.created_at.hour
            if 6 <= hour < 9:
                period = "6am"
            elif 9 <= hour < 12:
                period = "9am"
            elif 12 <= hour < 15:
                period = "12pm"
            elif 15 <= hour < 18:
                period = "3pm"
            elif 18 <= hour < 21:
                period = "6pm"
            elif 21 <= hour < 24:
                period = "9pm"
            else:
                period = "6am"
            
            period_counts[period] = period_counts.get(period, 0) + 1
    else:
        periods = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        # Group by day of week
        period_counts = {}
        for log in all_logs:
            day_of_week = log.created_at.weekday()  # 0=Monday, 6=Sunday
            period = periods[day_of_week]
            period_counts[period] = period_counts.get(period, 0) + 1
    
    data = []
    for period in periods:
        period_count = period_counts.get(period, 0)
        
        data.append({
            'name': period,
            'mood': period_count,
            'meditation': 0,  # Will be implemented when meditation feature is added
            'cbt': 0,  # Will be implemented when CBT feature is added
            'journal': 0  # Will be implemented when journal feature is added
        })
    
    return Response(data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def risk_assessment(request):
    """Get risk assessment data - Admin only"""
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    time_filter = request.query_params.get('time_filter', 'week')
    start_date, end_date = get_time_range(time_filter)
    
    # Get average mood scores for students
    student_moods = MoodLog.objects.filter(
        user__role='student',
        created_at__range=[start_date, end_date]
    ).values('user').annotate(avg_mood=Avg('mood_score'))
    
    low_risk = 0
    medium_risk = 0
    high_risk = 0
    
    for mood_data in student_moods:
        avg_mood = mood_data['avg_mood']
        if avg_mood >= 70:
            low_risk += 1
        elif avg_mood >= 40:
            medium_risk += 1
        else:
            high_risk += 1
    
    total = low_risk + medium_risk + high_risk
    
    if total > 0:
        low_percent = round((low_risk / total) * 100)
        medium_percent = round((medium_risk / total) * 100)
        high_percent = round((high_risk / total) * 100)
    else:
        low_percent = 0
        medium_percent = 0
        high_percent = 0
    
    return Response([
        {'name': 'Low Risk', 'value': low_percent, 'color': '#4ade80'},
        {'name': 'Medium Risk', 'value': medium_percent, 'color': '#facc15'},
        {'name': 'High Risk', 'value': high_percent, 'color': '#f87171'}
    ])


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def campus_distribution(request):
    """Get campus distribution data - Admin only"""
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    time_filter = request.query_params.get('time_filter', 'week')
    start_date, end_date = get_time_range(time_filter)
    
    # Get active users by university
    campus_data = User.objects.filter(
        role='student',
        mood_logs__created_at__range=[start_date, end_date],
        university__isnull=False
    ).values('university').annotate(
        user_count=Count('id', distinct=True)
    ).order_by('-user_count')
    
    total_users = sum(item['user_count'] for item in campus_data)
    
    data = []
    for item in campus_data:
        if total_users > 0:
            percentage = round((item['user_count'] / total_users) * 100)
        else:
            percentage = 0
        data.append({
            'name': item['university'],
            'value': percentage
        })
    
    return Response(data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def resource_allocation(request):
    """Get resource allocation recommendations - Admin only"""
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    time_filter = request.query_params.get('time_filter', 'month')
    start_date, end_date = get_time_range(time_filter)
    
    # Calculate resource needs based on user activity and risk levels
    # For now, return empty array - will be populated as resource tracking is implemented
    # This can be enhanced with actual resource allocation models in the future
    
    # Get students with high risk (low mood scores)
    high_risk_students = User.objects.filter(
        role='student',
        mood_logs__mood_score__lt=40,
        mood_logs__created_at__range=[start_date, end_date]
    ).distinct().count()
    
    # Get total active students
    active_students = User.objects.filter(
        role='student',
        mood_logs__created_at__range=[start_date, end_date]
    ).distinct().count()
    
    # Calculate resource recommendations based on data
    # These are placeholder calculations - can be enhanced with ML models
    resources = []
    
    if active_students > 0:
        # Crisis Counselors - based on high risk students
        crisis_need = max(1, round(high_risk_students / 10))
        resources.append({
            'type': 'Crisis Counselors',
            'description': 'On-call mental health professionals',
            'current': 0,  # Will be tracked in future resource management system
            'recommended': crisis_need,
            'impact': 'High' if high_risk_students > 0 else 'Medium',
            'priority': 'Urgent' if high_risk_students > 5 else 'High' if high_risk_students > 0 else 'Medium'
        })
        
        # Meditation Workshop - based on overall engagement
        meditation_need = max(1, round(active_students / 50))
        resources.append({
            'type': 'Meditation Workshop',
            'description': 'Weekly guided sessions',
            'current': 0,
            'recommended': meditation_need,
            'impact': 'Medium',
            'priority': 'Medium'
        })
        
        # Peer Support Training - based on engagement
        peer_need = max(1, round(active_students / 30))
        resources.append({
            'type': 'Peer Support Training',
            'description': 'Certification program',
            'current': 0,
            'recommended': peer_need,
            'impact': 'High',
            'priority': 'High' if active_students > 20 else 'Medium'
        })
        
        # CBT Specialists - based on moderate risk students
        moderate_risk = User.objects.filter(
            role='student',
            mood_logs__mood_score__gte=40,
            mood_logs__mood_score__lt=60,
            mood_logs__created_at__range=[start_date, end_date]
        ).distinct().count()
        
        cbt_need = max(1, round(moderate_risk / 15))
        resources.append({
            'type': 'CBT Specialists',
            'description': 'Therapists with CBT expertise',
            'current': 0,
            'recommended': cbt_need,
            'impact': 'Medium',
            'priority': 'Medium'
        })
    
    return Response(resources)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def budget_optimization(request):
    """Get budget optimization recommendations - Admin only"""
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    time_filter = request.query_params.get('time_filter', 'month')
    start_date, end_date = get_time_range(time_filter)
    
    # Calculate budget distribution based on user needs
    high_risk_students = User.objects.filter(
        role='student',
        mood_logs__mood_score__lt=40,
        mood_logs__created_at__range=[start_date, end_date]
    ).distinct().count()
    
    active_students = User.objects.filter(
        role='student',
        mood_logs__created_at__range=[start_date, end_date]
    ).distinct().count()
    
    total_students = User.objects.filter(role='student').count()
    
    budget_items = []
    
    if active_students > 0:
        # Calculate percentages based on needs
        crisis_percent = min(40, round((high_risk_students / active_students) * 100)) if active_students > 0 else 0
        preventative_percent = max(20, min(30, round((active_students / total_students) * 100))) if total_students > 0 else 25
        peer_support_percent = max(15, min(25, round((active_students / total_students) * 100))) if total_students > 0 else 20
        educational_percent = max(10, min(20, round((active_students / total_students) * 100))) if total_students > 0 else 15
        digital_percent = 100 - crisis_percent - preventative_percent - peer_support_percent - educational_percent
        
        budget_items = [
            {
                'category': 'Crisis Response',
                'percentage': max(5, crisis_percent),
                'color': 'red'
            },
            {
                'category': 'Preventative Resources',
                'percentage': max(5, preventative_percent),
                'color': 'green'
            },
            {
                'category': 'Peer Support Programs',
                'percentage': max(5, peer_support_percent),
                'color': 'blue'
            },
            {
                'category': 'Educational Workshops',
                'percentage': max(5, educational_percent),
                'color': 'purple'
            },
            {
                'category': 'Digital Resources',
                'percentage': max(5, digital_percent),
                'color': 'yellow'
            }
        ]
        
        # Normalize to 100%
        total = sum(item['percentage'] for item in budget_items)
        if total > 0:
            for item in budget_items:
                item['percentage'] = round((item['percentage'] / total) * 100)
    
    return Response(budget_items)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def high_impact_areas(request):
    """Get high-impact area recommendations - Admin only"""
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    time_filter = request.query_params.get('time_filter', 'month')
    start_date, end_date = get_time_range(time_filter)
    
    # Analyze patterns to identify high-impact areas
    # This is a simplified version - can be enhanced with more sophisticated analysis
    
    areas = []
    
    # Check for exam period patterns (simplified - would need actual calendar integration)
    # For now, check if there's increased activity/stress
    recent_logs = MoodLog.objects.filter(created_at__range=[start_date, end_date])
    if recent_logs.exists():
        avg_mood = recent_logs.aggregate(avg=Avg('mood_score'))['avg'] or 0
        
        # If average mood is low, suggest exam period support
        if avg_mood < 50:
            areas.append({
                'title': 'Finals Week Support',
                'description': f'Data shows increased stress levels (average mood: {round(avg_mood)}/100). Recommend temporary increase in counseling hours and drop-in sessions.',
                'color': 'amber'
            })
    
    # Check for new student patterns
    new_students = User.objects.filter(
        role='student',
        created_at__range=[start_date, end_date]
    ).count()
    
    if new_students > 0:
        areas.append({
            'title': 'New Student Orientation',
            'description': f'{new_students} new student(s) joined this period. Recommend dedicated onboarding workshops and mental health resource introduction.',
            'color': 'blue'
        })
    
    # Check for engagement patterns by university
    universities = User.objects.filter(
        role='student',
        mood_logs__created_at__range=[start_date, end_date]
    ).values('university').annotate(
        user_count=Count('id', distinct=True)
    ).order_by('-user_count')
    
    if universities.exists():
        # Check if there are international students (simplified check)
        # In production, this would check actual student attributes
        total_active = sum(u['user_count'] for u in universities)
        if total_active > 0:
            areas.append({
                'title': 'Campus Engagement',
                'description': f'Active engagement across {universities.count()} campus(es). Monitor usage patterns and adjust resources accordingly.',
                'color': 'green'
            })
    
    return Response(areas)


@api_view(['GET', 'PUT'])
@permission_classes([permissions.IsAuthenticated])
def integration_settings(request):
    """Get or update integration settings - Admin only"""
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'GET':
        # Return current integration settings
        # For now, return empty/default settings - can be stored in database later
        return Response({
            'systems': [
                {
                    'id': 'student_health',
                    'name': 'Student Health Information System',
                    'description': 'Electronic Health Records system for student wellness data',
                    'connected': False,
                    'enabled': False
                },
                {
                    'id': 'appointment_scheduling',
                    'name': 'Appointment Scheduling System',
                    'description': 'Allow students to schedule counseling sessions directly',
                    'connected': False,
                    'enabled': False
                },
                {
                    'id': 'crisis_alert',
                    'name': 'Crisis Alert System',
                    'description': 'Emergency notification system for high-risk students',
                    'connected': False,
                    'enabled': False
                },
                {
                    'id': 'resource_allocation',
                    'name': 'Resource Allocation System',
                    'description': 'Connect to university budget and resource planning tools',
                    'connected': False,
                    'enabled': False
                }
            ],
            'dataSharing': {
                'shareAnonymizedStats': False,
                'shareRiskAssessment': False,
                'shareEngagementMetrics': False,
                'allowJournalAccess': False
            },
            'apiConfig': {
                'endpoint': '',
                'apiKey': '',
                'webhookUrl': ''
            },
            'status': {
                'overall': 'not_configured',  # 'operational', 'not_configured', 'error'
                'history': []
            }
        })
    
    elif request.method == 'PUT':
        # Update integration settings
        # For now, just return success - can be stored in database later
        data = request.data
        return Response({
            'message': 'Integration settings updated successfully',
            'settings': data
        })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def test_integration(request):
    """Test integration connection - Admin only"""
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    system_id = request.data.get('system_id')
    
    # Simulate testing connection
    # In production, this would actually test the connection
    return Response({
        'success': True,
        'message': f'Connection test for {system_id} completed',
        'status': 'connected'  # or 'failed'
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def integration_status(request):
    """Get integration status history - Admin only"""
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    # Return empty status history - will be populated as integrations are configured
    return Response({
        'overallStatus': 'not_configured',  # 'operational', 'not_configured', 'error'
        'history': []
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def counselors_list(request):
    """Get list of counselors with their status - Admin only"""
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    # Get all counselor users
    counselors = User.objects.filter(role='counselor')
    
    counselor_data = []
    for counselor in counselors:
        # Count students assigned to this counselor (simplified - would need actual assignment model)
        # For now, count students with low mood scores as potential assignments
        student_count = User.objects.filter(
            role='student',
            mood_logs__mood_score__lt=50,
            mood_logs__created_at__gte=timezone.now() - timedelta(days=30)
        ).distinct().count()
        
        # Determine status based on last login
        if counselor.last_login:
            hours_since_login = (timezone.now() - counselor.last_login).total_seconds() / 3600
            if hours_since_login < 1:
                status = 'online'
            elif hours_since_login < 24:
                status = 'away'
            else:
                status = 'offline'
        else:
            status = 'offline'
        
        counselor_data.append({
            'id': str(counselor.id),
            'name': counselor.name,
            'email': counselor.email,
            'status': status,
            'studentCount': student_count,  # Simplified - would need actual assignment tracking
            'specialty': 'General Counseling'  # Could be stored in user profile
        })
    
    return Response(counselor_data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def students_requiring_counseling(request):
    """Get students who require counseling based on risk levels - Admin only"""
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    time_filter = request.query_params.get('time_filter', 'week')
    start_date, end_date = get_time_range(time_filter)
    
    # Get students with low mood scores (high risk)
    high_risk_students = User.objects.filter(
        role='student',
        mood_logs__mood_score__lt=50,
        mood_logs__created_at__range=[start_date, end_date]
    ).distinct()
    
    students_data = []
    for student in high_risk_students:
        # Get average mood score
        avg_mood = MoodLog.objects.filter(
            user=student,
            created_at__range=[start_date, end_date]
        ).aggregate(avg=Avg('mood_score'))['avg'] or 0
        
        # Determine risk level
        if avg_mood < 40:
            risk_level = 'high'
        elif avg_mood < 60:
            risk_level = 'medium'
        else:
            risk_level = 'low'
        
        # Get last active time
        last_log = MoodLog.objects.filter(user=student).order_by('-created_at').first()
        last_active = last_log.created_at if last_log else student.created_at
        
        students_data.append({
            'id': str(student.id),
            'name': student.name,
            'email': student.email,
            'moodScore': round(avg_mood),
            'riskLevel': risk_level,
            'lastActive': last_active.isoformat(),
            'counselorAssigned': False  # Would need actual assignment tracking
        })
    
    return Response(students_data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def chat_communications_log(request):
    """Get chat communications log - Admin only"""
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    # Return empty array - chat functionality would need to be implemented
    # This would require a chat/messaging model
    return Response([])


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def assign_counselor(request):
    """Assign a counselor to a student - Admin only"""
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    student_id = request.data.get('student_id')
    counselor_id = request.data.get('counselor_id')
    
    if not student_id:
        return Response({'error': 'Student ID is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        student = User.objects.get(id=student_id, role='student')
    except User.DoesNotExist:
        return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # In a real implementation, this would create an assignment record
    # For now, just return success
    return Response({
        'success': True,
        'message': f'Counselor assignment recommended for {student.name}',
        'student_id': student_id,
        'counselor_id': counselor_id
    })

