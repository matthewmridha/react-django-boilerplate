from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from rest_framework import serializers
from django.dispatch import receiver
    

# Create your models here.

class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """
    def create_user(self, email, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        extra_fields.setdefault('is_active', True)
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)



# configure for production
def user_image_upload_to(instance, filename):
    return 'users/{0}/profile_picture/{1}'.format(instance.email, filename)

GENDER_SELECTION = [
    ('M', 'Male'),
    ('F', 'Female'),
    ('O', 'Other'),
]

class CustomUser(AbstractUser):
    
    username = models.CharField(max_length=30, null=True, blank=True)
    gender = models.CharField(max_length=20, choices=GENDER_SELECTION, default='M')
    phone_number = models.CharField(max_length=30, null=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=164, blank=True, null=True)
    last_name = models.CharField(max_length=164, blank=True, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()
    def clean_first_name(self):
        return self.cleaned_data['first_name'].capitalize()
    def clean_last_name(self):
        return self.cleaned_data['last_name'].capitalize()
    def __str__(self):
        return self.email
    


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'first_name', 'last_name')
