from rest_framework import serializers
from .models import User,StudentProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','username','email','role','phone']

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=StudentProfile
        fields=['id', 'faculty', 'semester', 'cgpa', 'student_id']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['username','email','password','role','phone']
        
    def create(self,validated_data):
        user=User.objects.create_user(
            username=validated_data['username'],
             email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role','student'),
            phone=validated_data.get('phone', '')
            )
        return user