from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from dj_rest_auth.views import PasswordResetConfirmView ##
from . import views
urlpatterns = [
    path('user/create/', views.CustomUserCreate.as_view(), name="create_user"), # create user
    path('token/obtain_token_with_email/', views.ObtainTokenPairView.as_view(), name='token_create'), # tokens with extra field (email)
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    path(r'^', include('django.contrib.auth.urls')),
    path('rest-auth/password/reset/confirm/<slug:uidb64>/<slug:token>/',
        PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    
]