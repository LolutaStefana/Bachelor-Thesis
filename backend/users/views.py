from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed, NotFound
from .serializers import UserSerializer, UserProfileUpdateSerializer
from rest_framework import permissions, status
from .models import User
from rest_framework.generics import ListAPIView
from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse
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