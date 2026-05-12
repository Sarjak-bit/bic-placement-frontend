from django.contrib.auth.models import AbstractUser
from django.db import models
class User(AbstractUser):
    ROLE_CHOICES =(
        ("student","Student"),
        ("admin","Admin")
    )
    role=models.CharField(max_length=10,choices=ROLE_CHOICES,default='student')
    phone=models.CharField(max_length=15,blank=True)

class StudentProfile(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    faculty=models.CharField(max_length=10)
    semester=models.IntegerField()
    cgpa=models.DecimalField(max_digits=4,decimal_places=2)
    student_id=models.CharField(max_length=20, unique=True)

    def __str__(self):
        return f"{self.user.username}-{self.faculty}"

