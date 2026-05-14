from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Application
from .serializers import ApplicationSerializer
from jobs.models import Job

class ApplicationView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'admin':
            applications = Application.objects.all()
        else:
            applications = Application.objects.filter(student=request.user)
        
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)
    def post(self, request):
        if request.user.role == 'admin':
            return Response({'message': 'Admin cannot apply for jobs'}, status=403)
        
        job_id = request.data.get('job')

        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response({'message': 'Job not found'}, status=404)

        if Application.objects.filter(student=request.user, job=job).exists():
            return Response({'message': 'You have already applied for this job'}, status=400)
        application = Application.objects.create(
            student=request.user,
            job=job,
        )
        serializer = ApplicationSerializer(application)
        return Response(serializer.data, status=201)

