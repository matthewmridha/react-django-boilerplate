from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny


class HelloView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {'message': 'Hello, World! - You are Authenticated'}
        return Response(content)

class OpenHelloView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        content = {'message' : 'Open World' }
        return Response(content)
