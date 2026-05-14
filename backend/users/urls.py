from django.urls import path
from .views import RegisterView,ProfileView,StudentProfileView,AnalyticsView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns =[
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
     path('profile/', ProfileView.as_view(), name='profile'),
     path('student-profile/', StudentProfileView.as_view(), name='student-profile'),
     path('analytics/', AnalyticsView.as_view(), name='analytics'),
]