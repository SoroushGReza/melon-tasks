from django.urls import path
from accounts import views
from .views import UserRegistrationView

urlpatterns = [
    path('accounts/', views.AccountList.as_view()),
    path('accounts/<int:pk>/', views.AccountDetail.as_view()),
    path(
        'account/<int:pk>/',
        views.AccountDetail.as_view(),
        name='account_detail',
    ),
    path(
        'register/',
        UserRegistrationView.as_view(),
        name='register'
    ),
]
