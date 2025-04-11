from django.urls import path, include
from .views import GoogleLoginAPIView

urlpatterns = [
    path("api/auth/", include("dj_rest_auth.urls")),
    path("api/auth/registration/", include("dj_rest_auth.registration.urls")),
    path("api/auth/", include("allauth.socialaccount.urls")),
    path("auth/google/", GoogleLoginAPIView.as_view(), name="google-login"),
]
