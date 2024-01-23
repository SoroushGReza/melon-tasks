from .models import Account
from django.contrib.auth import get_user_model
from rest_framework import serializers

# Get the user model currently active in this project
User = get_user_model()


# Serializer for user registration
class UserRegistrationSerializer(serializers.ModelSerializer):
    # Additional field for password confirmation
    password2 = serializers.CharField(
        style={'input_type': 'password'}, write_only=True
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}  # Hide password from being read
        }

    # Save method to handle user creation
    def save(self):
        # Create a new user instance with email and username
        account = User(
            email=self.validated_data['email'],
            username=self.validated_data['username']
        )
        # Get password and confirmation password from validated data
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        # Check if passwords match
        if password != password2:
            raise serializers.ValidationError(
                {'password': 'Passwords must match.'}
            )
        # Set password for the user and save it
        account.set_password(password)
        account.save()
        return account


# Serializer for the Account model
class AccountSerializer(serializers.ModelSerializer):
    # Field to check if the request user is the owner of account
    is_owner = serializers.SerializerMethodField()
    # Read-only field to display the username of account owner
    owner = serializers.ReadOnlyField(source="owner.username")

    # Method to determine if the request user is the owner
    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    class Meta:
        model = Account
        fields = [
            'owner', 'id', 'created_at', 'updated_at',
            'name', 'content', 'image', 'is_owner'
        ]
