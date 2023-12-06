from .models import Account
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(
        style={'input_type': 'password'}, write_only=True
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self):
        account = User(
            email=self.validated_data['email'],
            username=self.validated_data['username']
        )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if password != password2:
            raise serializers.ValidationError(
                {'password': 'Passwords must match.'}
            )
        account.set_password(password)
        account.save()
        return account


class AccountSerializer(serializers.ModelSerializer):
    is_owner = serializers.SerializerMethodField()
    owner = serializers.ReadOnlyField(source="owner.username")

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    class Meta:
        model = Account
        fields = [
            'owner', 'id', 'created_at', 'updated_at',
            'name', 'content', 'image', 'is_owner'
        ]
