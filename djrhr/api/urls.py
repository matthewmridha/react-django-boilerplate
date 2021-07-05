from django.urls import path
from api import views

urlpatterns = [
    path('hello/', views.HelloView.as_view(), name='hello'),
    path('open_hello/', views.OpenHelloView.as_view(), name='open_hello'),
]