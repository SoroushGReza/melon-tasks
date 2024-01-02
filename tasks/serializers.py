from django.contrib.humanize.templatetags.humanize import naturaltime
from rest_framework import serializers
from .models import Task, Comment
from django.contrib.auth.models import User


class TaskSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()

    # Permit users to read task
    permit_users = serializers.SlugRelatedField(
        many=True,
        queryset=User.objects.all(),
        slug_field='username',
        required=False
    )

    def __init__(self, *args, **kwargs):
        super(TaskSerializer, self).__init__(*args, **kwargs)
        # Make all fields optionnal
        for field in self.fields:
            self.fields[field].required = False

    def get_created_at(self, obj):
        return naturaltime(obj.created_at)

    def get_updated_at(self, obj):
        return naturaltime(obj.updated_at)

    class Meta:
        model = Task
        fields = [
            "id",
            "owner",
            "permit_users",
            "created_at",
            "updated_at",
            "title",
            "content",
            "due_date",
            "image",
            "is_overdue",
            "is_public",
            "priority",
            "category",
            "status",
        ]

    def validate_image(self, value):
        if value.size > 1024 * 1024 * 3:
            raise serializers.ValidationError(
                'Image size cant be larger than 3MB!'
            )
        if value.image.width > 5000:
            raise serializers.ValidationError(
                'Image cant have larger width than 5000px!'
            )
        if value.image.height > 5000:
            raise serializers.ValidationError(
                'Image cant have larger height than 5000px!'
            )
        return value

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner


class UserSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Comment
        fields = ['id', 'task', 'author', 'content', 'created_at']
