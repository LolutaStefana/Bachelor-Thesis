from django.urls import path
from .views import RegisterView, LoginView, UserView, LogoutView, NormalUserListView, TherapistListView, \
    Send2FAEmailAPIView, UserProfileUpdateView, TherapistDetailView, AppointmentListView, CreateAppointmentView, \
    UpdateAppointmentStatusView, EvaluateResponsesView, TherapistAppointmentListView, \
    UpdateTherapistAppointmentStatusView

urlpatterns = [
    path('register', RegisterView.as_view()) ,
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path('users/normal', NormalUserListView.as_view()),
    path('users/therapists', TherapistListView.as_view()),
    path('send-2fa-email', Send2FAEmailAPIView.as_view()),
    path('user/profile/update', UserProfileUpdateView.as_view()),
    path('therapists/<int:pk>', TherapistDetailView.as_view()),
    path('appointments/<int:user_id>', AppointmentListView.as_view()),
    path('appointments/create', CreateAppointmentView.as_view()),
    path('appointments/update/<int:pk>', UpdateAppointmentStatusView.as_view()),
    path('evaluate-responses', EvaluateResponsesView.as_view()),
    path('therapist/appointments/', TherapistAppointmentListView.as_view()),
    path('therapist/appointment/status/<int:pk>/', UpdateTherapistAppointmentStatusView.as_view()),
]