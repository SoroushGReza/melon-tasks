from django.contrib.humanize.templatetags.humanize import naturaltime
from rest_framework import serializers
from .models import Task, Comment
from django.contrib.auth.models import User


# Serializer for Task model
class TaskSerializer(serializers.ModelSerializer):
    # Read only fields to display the owners username and formatted timestamps
    owner = serializers.ReadOnlyField(source="owner.username")
    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()

    # Serializer for permit_users field, allows selection
    # of multiple users by username
    permit_users = serializers.SlugRelatedField(
        many=True,
        queryset=User.objects.all(),
        slug_field='username',
        required=False
    )

    def __init__(self, *args, **kwargs):
        super(TaskSerializer, self).__init__(*args, **kwargs)
        # Make all fields optional in the serializer
        for field in self.fields:
            self.fields[field].required = False

    # Format creation and update timestamps using natural time
    def get_created_at(self, obj):
        return naturaltime(obj.created_at)

    def get_updated_at(self, obj):
        return naturaltime(obj.updated_at)

    class Meta:
        # Linking the serializer to the Task model
        # and specifying fields to be included
        model = Task
        fields = [
            "id", "owner", "permit_users", "created_at", "updated_at",
            "title", "content", "due_date", "image", "is_overdue",
            "is_public", "priority", "category", "status",
        ]

    # Validate the uploaded image size and dimensions
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

    # Check if the user making the request is owner of the task
    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner


# Serializer for User model for search functionality
class UserSearchSerializer(serializers.ModelSerializer):
    class Meta:
        # Linking the serializer to the User model
        # and specifying fields to be included
        model = User
        fields = ['id', 'username']


# Comment serializer
class CommentSerializer(serializers.ModelSerializer):
    # Read-only field to display author username
    author = serializers.ReadOnlyField(source='author.username')

    class Meta:
        # Linking the serializer to the Comment model
        # and specifying fields to include
        model = Comment
        fields = ['id', 'task', 'author', 'content', 'created_at']
