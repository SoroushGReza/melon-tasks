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
from django.db.models import Q
from django.shortcuts import get_object_or_404


class TaskListCreate(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.filter(
            Q(is_public=True) |
            Q(owner=user) |
            Q(is_public=False, permit_users=user)
        )

        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        return queryset

    def perform_create(self, serializer):
        task = serializer.save(owner=self.request.user)
        permit_usernames = self.request.data.get('permit_users', [])
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
        user = self.request.user
        task = get_object_or_404(Task, pk=pk)
        if task.is_public or task.owner == user or user in task.permit_users.all():
            self.check_object_permissions(self.request, task)
            return task
        else:
            raise Http404

    def get(self, request, pk):
        task = self.get_object(pk)
        serializer = TaskSerializer(task, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        task = self.get_object(pk)
        serializer = TaskSerializer(
            task, data=request.data, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):
        task = self.get_object(pk)
        task.delete()
        return Response(
            status=status.HTTP_204_NO_CONTENT
        )


class UserSearchView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSearchSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ['username']

    def get_queryset(self):
        queryset = super().get_queryset()
        username = self.request.query_params.get('username', None)
        if username is not None:
            queryset = queryset.filter(username__icontains=username)
        return queryset

    def list(self, request, *args, **kwargs):
        response = super(UserSearchView, self).list(request, *args, **kwargs)
        if not response.data:
            return Response(
                {'User not found'}, status=status.HTTP_404_NOT_FOUND
            )
        return response


class CommentListCreate(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        task_id = self.request.query_params.get('task_id')
        if task_id:
            task = get_object_or_404(Task, pk=task_id)
            if task.is_public:
                return queryset.filter(task=task)
            elif self.request.user in task.permit_users.all() or self.request.user == task.owner:
                return queryset.filter(task=task)
            else:
                raise PermissionDenied(
                    "You do not have permission to view these comments."
                )
        return queryset.none()

    def perform_create(self, serializer):
        task_id = self.request.data.get('task')
        task = get_object_or_404(Task, pk=task_id)
        if task.is_public or self.request.user in task.permit_users.all() or self.request.user == task.owner:
            serializer.save(author=self.request.user)
        else:
            raise PermissionDenied(
                "You do not have permission to comment on this task."
            )


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
