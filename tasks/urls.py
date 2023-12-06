from django.urls import path
from .views import TaskListCreate, TaskDetail, UserSearchView
from .views import CommentListCreate, CommentDetail

urlpatterns = [
    path('tasks/', TaskListCreate.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', TaskDetail.as_view()),
    path('search-users/', UserSearchView.as_view(), name='search-users'),
    path('comments/', CommentListCreate.as_view(), name='comment-list'),
    path('comments/<int:pk>/', CommentDetail.as_view(), name='comment-detail'),
]
