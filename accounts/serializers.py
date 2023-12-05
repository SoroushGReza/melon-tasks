from rest_framework import serializers
from .models import Account


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
