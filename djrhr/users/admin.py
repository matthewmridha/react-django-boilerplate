from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser 
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
# Register your models here.

class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    form = CustomUserChangeForm
    list_display = ['username', 'email', 'is_superuser',]
    list_filter = ('is_staff', 'is_active',)
    fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email','password', 'is_staff', 'is_active', 'first_name', 'middle_name', 'last_name',)}
        ),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'user_type', 'is_staff', 'is_active','first_name', 'middle_name', 'last_name', )}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)

admin.site.register(CustomUser, CustomUserAdmin)
