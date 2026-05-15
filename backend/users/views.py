from rest_framework import status
from rest_framework.response import Response 
from rest_framework.views import APIView
from .serializers import UserSerializer,RegisterSerializer,StudentProfileSerializer
from .models import User, StudentProfile
from jobs.models import Job
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

class RegisterView(APIView):
    def post(self,request):
        serializer=RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User Registered Successfully'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class StudentProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = StudentProfile.objects.get(user=request.user)
            serializer = StudentProfileSerializer(profile)
            return Response(serializer.data)
        except StudentProfile.DoesNotExist:
            return Response({'message': 'Profile not found'}, status=404)

    def post(self, request):
        if StudentProfile.objects.filter(user=request.user).exists():
            return Response({'message': 'Profile already exists, use PATCH to update'}, status=400)
        
        serializer = StudentProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def patch(self, request):
        try:
            profile = StudentProfile.objects.get(user=request.user)
        except StudentProfile.DoesNotExist:
            return Response({'message': 'Profile not found'}, status=404)
        
        serializer = StudentProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

from applications.models import Application

class AnalyticsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'message': 'Only admin can view analytics'}, status=403)

        total_students = User.objects.filter(role='student').count()
        total_jobs = Job.objects.filter(is_active=True).count()
        total_applications = Application.objects.count()
        shortlisted = Application.objects.filter(status='shortlisted').count()
        selected = Application.objects.filter(status='selected').count()
        rejected = Application.objects.filter(status='rejected').count()

        data = {
            'total_students': total_students,
            'total_jobs': total_jobs,
            'total_applications': total_applications,
            'shortlisted': shortlisted,
            'selected': selected,
            'rejected': rejected,
        }
        return Response(data)

class ResumeUploadView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            profile = StudentProfile.objects.get(user=request.user)
        except StudentProfile.DoesNotExist:
            return Response({'message': 'Please create your profile first'}, status=404)

        if 'resume' not in request.FILES:
            return Response({'message': 'No file uploaded'}, status=400)

        file = request.FILES['resume']

        if not file.name.endswith('.pdf'):
            return Response({'message': 'Only PDF files are allowed'}, status=400)

        profile.resume = file
        profile.save()

        return Response({'message': 'Resume uploaded successfully', 'resume': profile.resume.url})

from .utils import extract_resume_data

class ResumeUploadView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if 'resume' not in request.FILES:
            return Response({'message': 'No file uploaded'}, status=400)

        file = request.FILES['resume']

        if not file.name.endswith('.pdf'):
            return Response({'message': 'Only PDF files are allowed'}, status=400)

        # Extract data from resume
        extracted_data = extract_resume_data(file)

        # Save file temporarily
        profile, created = StudentProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'faculty': '',
                'semester': 1,
                'cgpa': 0.0,
                'student_id': request.user.username,
            }
        )
        profile.resume = file
        profile.save()

        # Return extracted data for student to confirm
        return Response({
            'message': 'Resume uploaded! Please confirm or correct your details.',
            'resume': profile.resume.url,
            'extracted_data': extracted_data,
            'instructions': 'Send a PATCH request to /api/users/student-profile/ with confirmed data'
        })