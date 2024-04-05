from django.urls import path
from .views import RegisterView, LoginView, UserView, LogoutView, NormalUserListView, TherapistListView, \
    Send2FAEmailAPIView, UserProfileUpdateView

urlpatterns = [
    path('register', RegisterView.as_view()) ,
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path('users/normal', NormalUserListView.as_view()),
    path('users/therapists', TherapistListView.as_view()),
    path('send-2fa-email', Send2FAEmailAPIView.as_view()),
    path('user/profile/update', UserProfileUpdateView.as_view()),
]