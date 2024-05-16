from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed, NotFound
from .serializers import UserSerializer, UserProfileUpdateSerializer, AppointmentSerializer, GetAppointmentSerializer, \
    GetAppointmentForTherapistSerializer
from rest_framework import permissions, status, generics
from .models import User, Appointment
from rest_framework.generics import ListAPIView
from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse, Http404
from rest_framework.views import APIView
from django.utils.crypto import get_random_string
from django.core.cache import cache
import jwt, datetime


def verify_jwt_token(token):
    try:
        payload = jwt.decode(token, 'secret', algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Unauthenticated!')
    except jwt.DecodeError:
        raise AuthenticationFailed('Unauthenticated!')

    user = User.objects.filter(id=payload['id']).first()
    if user is None:
        raise AuthenticationFailed('Unauthenticated!')

    return user

# Create your views here.
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User not found!')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')

        response = Response()

        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt': token
        }
        return response


class UserView(APIView):

    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response


class NormalUserListView(ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        token = self.request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        user = verify_jwt_token(token)

        if not user.is_therapist:
            raise AuthenticationFailed('Access Denied: Users cannot view other users.')

        return User.objects.filter(is_therapist=False)


class TherapistListView(ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        token = self.request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        user = verify_jwt_token(token)

        if user.is_therapist:
            raise AuthenticationFailed('Access Denied: Therapists cannot view other therapists.')

        return User.objects.filter(is_therapist=True)


class Send2FAEmailAPIView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        two_fa_code = request.data.get('twoFACode', None)  # This might be None for sending code

        if not email:
            return JsonResponse({"error": "Email address is required."}, status=400)

        # Check if this is a verification attempt (twoFACode is provided)
        if two_fa_code:
            # Attempt to verify the 2FA code
            expected_code = cache.get(f"2fa_code_{email}")
            if two_fa_code == expected_code:
                cache.delete(f"2fa_code_{email}")  # Clear the code after successful verification
                # Proceed with registration or next steps here
                return JsonResponse({"message": "2FA code verified successfully."})
            else:
                return JsonResponse({"error": "Invalid or expired 2FA code."}, status=400)

        # For sending the 2FA code
        two_fa_code = get_random_string(length=6, allowed_chars='1234567890')
        cache.set(f"2fa_code_{email}", two_fa_code, timeout=300)  # 5 minutes expiry

        subject = 'Your 2FA Verification Code'
        message = f'Your verification code is: {two_fa_code}'
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [email]

        send_mail(subject, message, from_email, recipient_list)
        return JsonResponse({"message": "2FA code sent successfully."})
class UserProfileUpdateView(APIView):
    def put(self, request, *args, **kwargs):
        # Extract the JWT token from the request cookies (or headers, depending on your setup)
        token = request.COOKIES.get('jwt')  # Or request.headers.get('Authorization')
        if not token:
            return JsonResponse({'error': 'Authentication credentials were not provided.'}, status=401)

        # Verify the JWT token and get the user
        try:
            user = verify_jwt_token(token)
        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Token expired.'}, status=401)
        except jwt.DecodeError:
            return JsonResponse({'error': 'Error decoding token.'}, status=401)
        except AuthenticationFailed as e:
            return JsonResponse({'error': str(e)}, status=401)

        # Proceed with updating the user profile
        serializer = UserProfileUpdateSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            user_instance = serializer.save()

            if 'profile_picture' in request.FILES:
                user_instance.profile_picture = request.FILES['profile_picture']
                user_instance.save()

            updated_serializer = UserProfileUpdateSerializer(user_instance)
            return Response(updated_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class TherapistDetailView(APIView):
    def get(self, request, pk):
        therapist = User.objects.filter(id=pk, is_therapist=True).first()
        if therapist is None:
            raise NotFound('Therapist not found!')
        serializer = UserSerializer(therapist)
        return Response(serializer.data)


class CreateAppointmentView(APIView):
    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AppointmentListView(APIView):
    def get(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        appointments = Appointment.objects.filter(user=user)
        serializer = GetAppointmentSerializer(appointments, many=True)

        return Response(serializer.data)

class UpdateAppointmentStatusView(APIView):
    def patch(self, request, pk):
        appointment = Appointment.objects.get(pk=pk)
        if appointment.user.id != int(request.data.get('user')):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

CATEGORIES = {
    'anxiety': {'question_weights': {1: 2, 5: 1, 9: 3}},
    'depression': {'question_weights': {2: 3, 10: 2, 14: 1}},
    'stress': {'question_weights': {3: 2, 11: 1, 15: 1}},
    'sleep_quality': {'question_weights': {4: 3, 12: 1, 16: 1}},
    'substance_use': {'question_weights': {5: 3, 13: 1}},
    'relationship_issues': {'question_weights': {6: 2, 14: 2, 18: 1}},
    'self_esteem': {'question_weights': {7: 2, 15: 1, 19: 2}},
    'mood_swings': {'question_weights': {8: 3, 16: 2}},
    'eating_disorders': {'question_weights': {9: 3, 17: 2}},
    'anger_management': {'question_weights': {10: 3, 18: 2}},
    'bipolar_disorder': {'question_weights': {20: 3, 21: 2}},
    'social_anxiety': {'question_weights': {22: 3, 23: 2}},
    'ptsd': {'question_weights': {24: 2, 25: 2, 26: 1}},
    'ocd': {'question_weights': {27: 3, 28: 2}},
    'schizophrenia': {'question_weights': {29: 2, 30: 2, 31: 1}},
    'adhd': {'question_weights': {32: 3, 33: 1}},
    'autism_spectrum': {'question_weights': {34: 3, 35: 2}},
    'personality_disorders': {'question_weights': {36: 2, 37: 1, 38: 1}},
    'phobias': {'question_weights': {39: 3, 40: 2}},
    'general_wellbeing': {'question_weights': {41: 2, 42: 1, 43: 1}},
}

SCORE_RANGES = {
    'low': range(0, 10),
    'medium': range(10, 20),
    'high': range(20, 46)
}

class EvaluateResponsesView(APIView):
    def post(self, request):
        data = request.data.get('answers')
        scores = {key: 0 for key in CATEGORIES.keys()}
        max_scores = {key: 0 for key in CATEGORIES.keys()}

        # Calculate scores and max_scores based on weights
        for question_id, answer_value in data.items():
            question_id = int(question_id)
            for category, details in CATEGORIES.items():
                if question_id in details['question_weights']:
                    weight = details['question_weights'][question_id]
                    scores[category] += answer_value * weight
                    max_scores[category] += 5 * weight

        # Identify the two highest scores
        top_two_categories = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:2]

        # Find therapists that match these categories
        therapists = User.objects.filter(
            is_therapist=True,
            domain_of_interest__in=[category[0] for category in top_two_categories]
        )

        # Serialize therapist data
        therapist_data = [
            {
                'id': therapist.id,
                'name': therapist.name,
                'email': therapist.email,
                'country':therapist.country,
                'city':therapist.city,
                'domain_of_interest': therapist.domain_of_interest,
                'years_of_experience': therapist.years_of_experience,
                'is_verified': therapist.is_verified,
                'profile_picture': request.build_absolute_uri(therapist.profile_picture.url) if therapist.profile_picture else None
            }
            for therapist in therapists
        ]

        return Response({
            "results": {category: result for category, result in top_two_categories},
            "therapists": therapist_data,
            "message": "Scores calculated and classified successfully, therapists recommended based on top concerns."
        }, status=status.HTTP_200_OK)

class TherapistAppointmentListView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        therapist = verify_jwt_token(token)

        if not therapist.is_therapist:
             return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        appointments = Appointment.objects.filter(therapist=therapist)
        serializer = GetAppointmentForTherapistSerializer(appointments, many=True)
        return Response(serializer.data)
class UpdateTherapistAppointmentStatusView(APIView):

    def patch(self, request, pk):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        therapist = verify_jwt_token(token)

        if not therapist.is_therapist:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        appointment = Appointment.objects.filter(pk=pk, therapist=therapist).first()
        if appointment is None:
            raise NotFound('Appointment not found!')

        data = request.data
        if 'status' not in data:
            return Response({'error': 'Status is required'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AppointmentSerializer(appointment, data={'status': data['status']}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
