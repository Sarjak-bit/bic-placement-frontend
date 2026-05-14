from django.db import models
from users.models import User
from jobs.models import Job

class Application(models.Model):
    STATUS_CHOICES = (
        ('applied', 'Applied'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
        ('selected', 'Selected'),
    )
    student=models.ForeignKey(User, on_delete=models.CASCADE)
    job=models.ForeignKey(Job,on_delete=models.CASCADE)
    status=models.CharField(max_length=20,choices=STATUS_CHOICES,default='applied')
    applied_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together=['student','job']

    def __str__(self):
        return f"{self.student.username} - {self.job.title} - {self.status}"