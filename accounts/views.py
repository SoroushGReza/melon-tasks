from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Account
from .serializers import AccountSerializer, UserRegistrationSerializer
from rest_framework.generics import GenericAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListAPIView
from my_plans_drf_api.permissions import IsOwnerOrReadOnly
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import permissions, status, filters
from rest_framework_simplejwt.tokens import RefreshToken
from my_plans_drf_api.settings import (
    JWT_AUTH_COOKIE, JWT_AUTH_REFRESH_COOKIE,
    JWT_AUTH_SAMESITE, JWT_AUTH_SECURE,
)

# Get the User model from the currently active Django project
User = get_user_model()


# View for user registration
class UserRegistrationView(GenericAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]  # Allow any user to access this view

    # Post method to create a new user
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Refresh JWT tokens for the user
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View to list all accounts
class AccountList(ListAPIView):
    queryset = Account.objects.all()  # Define queryset for view
    serializer_class = AccountSerializer  # Serializer for Account
    filter_backends = [filters.SearchFilter]  # Add search filter
    search_fields = ['owner__username']  # Define fields to search by

    # Override get_queryset to add custom search function
    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(owner__username__icontains=search)
        return queryset

    # Override list method to handle search result
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if 'search' in request.query_params and not queryset.exists():
            return Response(
                {"message": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        return super().list(request, *args, **kwargs)


# View for handling individual account details with CRUD
class AccountDetail(RetrieveUpdateDestroyAPIView):
    queryset = Account.objects.all()  # Queryset for Account
    serializer_class = AccountSerializer  # Serializer for Account
    permission_classes = [IsOwnerOrReadOnly]  # Custom permission class

    # Get the object and check permissions
    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj


# View for user deletion
class DeleteUserView(APIView):
    # Only authenticated users can access this view
    permission_classes = [IsAuthenticated]

    # Delete method to handle user deletion
    def delete(self, request):
        password = request.data.get('password')
        if request.user.check_password(password):
            # Clear cookies and delete user
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
            return Response(
                {"error": "Password incorrect"},
                status=status.HTTP_400_BAD_REQUEST
            )
