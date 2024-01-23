from dj_rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers


# Serializer class for the current user
class CurrentUserSerializer(UserDetailsSerializer):
    # Create a read-only field for account_id
    account_id = serializers.ReadOnlyField(source='account.id')
    # Create a read-only field for account_image
    account_image = serializers.ReadOnlyField(source='account.image.url')

    # Meta class
    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + (
            'account_id', 'account_image'
        )
