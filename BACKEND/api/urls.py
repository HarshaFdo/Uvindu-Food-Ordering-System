from django.urls import path, include
from .views import GoogleLoginAPIView
from rest_framework.routers import DefaultRouter
from .views import MealViewSet
<<<<<<< HEAD
from .views import MealListAPIView
=======
from . import views
>>>>>>> 16e821d82ea54f81b6b09aa4378f29a65e816203

router = DefaultRouter()
router.register(r'meals', MealViewSet)

urlpatterns = [
    path("api/auth/", include("dj_rest_auth.urls")),
    path("api/auth/registration/", include("dj_rest_auth.registration.urls")),
    path("api/auth/", include("allauth.socialaccount.urls")),
    path("auth/google/", GoogleLoginAPIView.as_view(), name="google-login"),
    path('', include(router.urls)),
<<<<<<< HEAD
    path("meals/", MealListAPIView.as_view(), name="meal-list"),
=======
    path('user-count/', views.user_count, name='user-count'),
>>>>>>> 16e821d82ea54f81b6b09aa4378f29a65e816203
]
