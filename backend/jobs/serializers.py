from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'title', 'company', 'description', 'job_type',
                  'required_faculty', 'required_semester', 'required_cgpa',
                  'deadline', 'is_active', 'posted_by', 'created_at']
        read_only_fields = ['posted_by', 'created_at']