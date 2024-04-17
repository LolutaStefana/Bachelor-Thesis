from rest_framework import serializers
from .models import User, Appointment
from django.utils import timezone



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password', 'is_therapist', 'country', 'city', 'gender', 'date_of_birth', 'description', 'domain_of_interest', 'years_of_experience', 'is_verified', 'profile_picture']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'country', 'city', 'gender', 'description', 'profile_picture','date_of_birth']
        extra_kwargs = {
            'name': {'required': False},
            'country': {'required': False},
            'city': {'required': False},
            'gender': {'required': False},
            'description': {'required': False},
            'profile_picture': {'required': False},
            'date_of_birth': {'format': '%Y-%m-%d'},
        }
class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'user', 'therapist', 'status', 'scheduled_time', 'created_at', 'updated_at']


    def validate_scheduled_time(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("Cannot schedule an appointment in the past.")
        return value

    def validate(self, data):
        if data['user'] == data['therapist']:
            raise serializers.ValidationError("Cannot schedule an appointment with oneself.")
        return data