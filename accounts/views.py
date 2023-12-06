from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Account
from .serializers import AccountSerializer
from .serializers import UserRegistrationSerializer
from rest_framework.generics import GenericAPIView
from my_plans_drf_api.permissions import IsOwnerOrReadOnly
from django.contrib.auth import get_user_model
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.generics import RetrieveUpdateDestroyAPIView


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


class AccountList(APIView):
    def get(self, request):
        accounts = Account.objects.all()
        serializer = AccountSerializer(
            accounts, many=True,
            context={'request': request}
        )
        return Response(serializer.data)


class AccountDetail(RetrieveUpdateDestroyAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj