from django.urls import path
from .views import ApplicationView,ApplicationStatusView

urlpatterns = [
    path('', ApplicationView.as_view(), name='applications'),
    path('<int:pk>/status/', ApplicationStatusView.as_view(), name='application-status'),
]