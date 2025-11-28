"""
Management command to create a default admin user if one doesn't exist.
This is useful for deployment environments where shell access is not available.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates a default admin user if one does not exist'

    def handle(self, *args, **options):
        # Check if any admin user exists
        admin_exists = User.objects.filter(role='admin').exists()
        
        if admin_exists:
            self.stdout.write(
                self.style.SUCCESS('Admin user already exists. Skipping creation.')
            )
            return

        # Get admin credentials from environment variables
        admin_email = os.environ.get('ADMIN_EMAIL', 'admin@mindease.com')
        admin_password = os.environ.get('ADMIN_PASSWORD', None)
        
        if not admin_password:
            self.stdout.write(
                self.style.WARNING(
                    'ADMIN_PASSWORD not set in environment variables. '
                    'Skipping admin user creation. '
                    'Set ADMIN_EMAIL and ADMIN_PASSWORD to create an admin user automatically.'
                )
            )
            return

        # Create admin user
        try:
            admin_user = User.objects.create_user(
                email=admin_email,
                password=admin_password,
                role='admin',
                is_staff=True,
                is_superuser=True,
                is_active=True
            )
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created admin user: {admin_email}')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating admin user: {str(e)}')
            )

