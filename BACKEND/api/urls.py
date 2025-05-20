from django.urls import path, include
from .views import GoogleLoginAPIView
from rest_framework.routers import DefaultRouter
from .views import MealViewSet
from .views import MealListAPIView
from . import views

router = DefaultRouter()
router.register(r'meals', MealViewSet)

urlpatterns = [
    path("api/auth/", include("dj_rest_auth.urls")),
    path("api/auth/registration/", include("dj_rest_auth.registration.urls")),
    path("api/auth/", include("allauth.socialaccount.urls")),
    path("auth/google/", GoogleLoginAPIView.as_view(), name="google-login"),
    path('', include(router.urls)),
    path("meals/", MealListAPIView.as_view(), name="meal-list"),
    path('user-count/', views.user_count, name='user-count'),

]
