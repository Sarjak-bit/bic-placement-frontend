from django.shortcuts import render
from .serializers import JobSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Job
from users.models import StudentProfile

class JobListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        if request.user.role=='admin':
            jobs=Job.objects.filter(is_active=True)
        else:
            try:
                profile=StudentProfile.objects.get(user=request.user)
                jobs=Job.objects.filter(
                    is_active=True,
                    required_faculty=profile.faculty,
                    required_cgpa__lte=profile.cgpa,
                    required_semester__lte=profile.semester,
                )
            except StudentProfile.DoesNotExist:
                return Response({'message':'Please complete your profile first'}, status=400)
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)
    
    def post(self,request):
        if request.user.role!='admin':
            return Response({'message':'Only admin can post jobs'}, status=403)
        serializer=JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(posted_by=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)



