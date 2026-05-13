from django.db import models
from users.models import User

class Job(models.Model):
    JOB_TYPE_CHOICES = (
        ('internship', 'Internship'),
        ('fulltime', 'Full Time'),
        ('parttime', 'Part Time'),
    )
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    description = models.TextField()
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES)

    required_faculty = models.CharField(max_length=100)
    required_semester = models.IntegerField()
    required_cgpa = models.DecimalField(max_digits=4, decimal_places=2)

    posted_by = models.ForeignKey(User, on_delete=models.CASCADE)
    deadline = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} - {self.company}"