from rest_framework import serializers
from .models import Announcement

class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'posted_by', 'created_at', 'is_active']
        read_only_fields = ['posted_by', 'created_at']