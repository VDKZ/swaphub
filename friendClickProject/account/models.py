from __future__ import unicode_literals

from django.db import models
from django.utils import timezone
from django.dispatch import receiver
from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.contrib.auth.models import (
AbstractBaseUser, BaseUserManager, PermissionsMixin)


class UserManager(BaseUserManager):

    def create_user(
            self, email, password=None, is_active=True,
            **extra_fields):
        """Create a user instance with the given email and password."""
        email = UserManager.normalize_email(email)
        # Google OAuth2 backend send unnecessary username field
        extra_fields.pop('username', None)

        user = self.model(
            email=email, is_active=is_active,
            **extra_fields)
        if password:
            user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        return self.create_user(
            email, password, is_superuser=True, **extra_fields)

# Create your models here.

class User(PermissionsMixin, AbstractBaseUser):
    email = models.EmailField(unique=True, default='mail')
    is_active = models.BooleanField(default=True)
    points = models.IntegerField(default=2000) 
    rank = models.IntegerField(default=0)
    maxVisits = models.IntegerField(default=1000)
    date_joined = models.DateTimeField(default=timezone.now, editable=False)
    # notice the absence of a "Password field", that's built in.

    USERNAME_FIELD = 'email'

    objects = UserManager()

    def get_full_name(self):
        return self.email

    def get_short_name(self):
        return self.email

    def email_user(self, subject, message, from_email='noreply@swaphub.com', **kwargs):
        """Send an email to this user."""
        send_mail(subject, message, from_email, [self.email], **kwargs)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email_confirmed = models.BooleanField(default=False)
    # other fields...

@receiver(post_save, sender=User)
def update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()
