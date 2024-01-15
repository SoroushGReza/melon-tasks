from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Account
from .serializers import AccountSerializer
from .serializers import UserRegistrationSerializer
from rest_framework.generics import GenericAPIView
from my_plans_drf_api.permissions import IsOwnerOrReadOnly
from django.contrib.auth import get_user_model, authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework import generics, filters
from rest_framework_simplejwt.tokens import RefreshToken
from my_plans_drf_api.settings import (
    JWT_AUTH_COOKIE, JWT_AUTH_REFRESH_COOKIE, JWT_AUTH_SAMESITE,
    JWT_AUTH_SECURE,
)


User = get_user_model()

class UserRegistrationView(GenericAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AccountList(generics.ListAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['owner__username']

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(owner__username__icontains=search)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if 'search' in request.query_params and not queryset.exists():
            return Response(
                {"message": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        return super().list(request, *args, **kwargs)


class AccountDetail(RetrieveUpdateDestroyAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj

class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        password=request.data.get('password')
        if request.user.check_password(password):
            response = Response()
            response.set_cookie(
                key=JWT_AUTH_COOKIE,
                value='',
                httponly=True,
                expires='Thu, 01 Jan 1970 00:00:00 GMT',
                max_age=0,
                samesite=JWT_AUTH_SAMESITE,
                secure=JWT_AUTH_SECURE,
            )
            response.set_cookie(
                key=JWT_AUTH_REFRESH_COOKIE,
                value='',
                httponly=True,
                expires='Thu, 01 Jan 1970 00:00:00 GMT',
                max_age=0,
                samesite=JWT_AUTH_SAMESITE,
                secure=JWT_AUTH_SECURE,
            )
            request.user.delete()
            return response
        else:
            return Response({"error": "Password incorrect"}, status=status.HTTP_400_BAD_REQUEST)