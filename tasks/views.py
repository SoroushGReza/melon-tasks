from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django.http import Http404
from django.contrib.auth.models import User
from .models import Task, Comment
from .serializers import TaskSerializer, UserSearchSerializer
from .serializers import CommentSerializer
from my_plans_drf_api.permissions import IsOwnerOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.shortcuts import get_object_or_404


class TaskListCreate(generics.ListCreateAPIView):
    # Specify serializer class and permission
    # classes for the TaskListCreate view
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    # Set up filtering, searching, and ordering for task listing
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    # Define fields for filtering, searching, and ordering
    filterset_fields = ["status", "priority", "category", "owner", "is_public"]
    search_fields = ["title", "owner__username"]
    ordering_fields = ["due_date", "created_at"]

    def get_queryset(self):
        # Filter tasks based on the owner username and public visibility
        requested_username = self.request.query_params.get(
            "owner__username", None
        )
        if requested_username:
            if requested_username == self.request.user.username:
                return Task.objects.filter(owner__username=requested_username)
            else:
                return Task.objects.filter(
                    owner__username=requested_username, is_public=True
                )
        return Task.objects.none()

    def perform_create(self, serializer):
        # Assign logged in user as owner of a new task created
        task = serializer.save(owner=self.request.user)
        permit_usernames = self.request.data.get("permit_users", [])
        for username in permit_usernames:
            if username != self.request.user.username:
                try:
                    user = User.objects.get(username=username)
                    task.permit_users.add(user)
                except User.DoesNotExist:
                    continue


class TaskDetail(APIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_object(self, pk):
        # Retrieve task and check permissions
        # based on ownership and public status
        user = self.request.user
        task = get_object_or_404(Task, pk=pk)
        if (
            task.is_public or
            task.owner == user or
            user in task.permit_users.all()
        ):

            self.check_object_permissions(self.request, task)
            return task
        else:
            raise Http404

    def get(self, request, pk):
        # Handle GET request for task detail
        task = self.get_object(pk)
        serializer = TaskSerializer(task, context={"request": request})
        return Response(serializer.data)

    def put(self, request, pk):
        # Handles PUT request for updating task
        task = self.get_object(pk)
        serializer = TaskSerializer(
            task, data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        # Handles DELETE request for task
        task = self.get_object(pk)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserSearchView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSearchSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ["username"]

    def get_queryset(self):
        # Filter users based on a partal or full username match
        queryset = super().get_queryset()
        username = self.request.query_params.get("username", None)
        if username is not None:
            queryset = queryset.filter(username__icontains=username)
        return queryset

    def list(self, request, *args, **kwargs):
        # Override the default list to provide custom response
        response = super(UserSearchView, self).list(request, *args, **kwargs)
        if not response.data:
            return Response(
                {"User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        return response


class CommentListCreate(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):
        # Filter comments based on specific task ID and visibility
        queryset = super().get_queryset()
        task_id = self.request.query_params.get("task_id")
        if task_id:
            task = get_object_or_404(Task, pk=task_id)
            if task.is_public:
                return queryset.filter(task=task)
            elif (
                self.request.user in task.permit_users.all()
                or self.request.user == task.owner
            ):
                return queryset.filter(task=task)
            else:
                raise PermissionDenied(
                    "You do not have permission to view these comments."
                )
        return queryset.none()

    def perform_create(self, serializer):
        # Handle comment creation, ensuring user
        # has permission to comment the task
        task_id = self.request.data.get("task")
        task = get_object_or_404(Task, pk=task_id)
        if (
            task.is_public
            or self.request.user in task.permit_users.all()
            or self.request.user == task.owner
        ):
            serializer.save(author=self.request.user)
        else:
            raise PermissionDenied(
                "You do not have permission to comment on this task."
            )


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    # Inherit default permission classes and queryset handling
