# api/urls.py  ― put this inside the *api* Django app
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    GoogleLoginAPIView,
    MealViewSet,
    AdditionalMealViewSet,
    MealListAPIView,   # optional filtered list
    user_count,        # user-count endpoint


    ActiveOrderAPIView,

    set_order_time_status,
    get_order_time_status,


    set_order_time_status,
    get_order_time_status,

)

# ────────────────────────────────────────────────
# 1.  DRF router for all ViewSets
# ────────────────────────────────────────────────
router = DefaultRouter()
router.register(r"meals", MealViewSet, basename="meal")
router.register(r"additional-meals", AdditionalMealViewSet, basename="additionalmeal")

# ────────────────────────────────────────────────
# 2.  URL patterns for this *api* app
# ────────────────────────────────────────────────
urlpatterns = [
    # Auth / registration
    path("auth/", include("dj_rest_auth.urls")),
    path("auth/registration/", include("dj_rest_auth.registration.urls")),
    path("auth/google/", GoogleLoginAPIView.as_view(), name="google-login"),

    # Router endpoints  →  /api/meals/ , /api/additional-meals/, etc.
    path("", include(router.urls)),                    #  /api/…

    # Extra bespoke endpoints
    path("meals/available/", MealListAPIView.as_view(), name="available-meal-list"),
    path("user-count/", user_count, name="user-count"),



    # Active Order
    path('api/active-orders/', ActiveOrderAPIView.as_view(), name='active-orders'),

    path("set-order-time-status/", set_order_time_status, name="set-order-time-status"),
    path("get-order-time-status/", get_order_time_status, name="get-order-time-status"),



    path("set-order-time-status/", set_order_time_status, name="set-order-time-status"),
    path("get-order-time-status/", get_order_time_status, name="get-order-time-status"),


]
