# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    GoogleLoginAPIView,
    MealViewSet,
    AdditionalMealViewSet,
    MealListAPIView,   
    user_count,    
    NotificationViewSet, 
    AdvertisementViewSet,
    set_order_time_status,
    get_order_time_status,
    OrderViewSet,
    ActiveOrderAPIView,
    PlaceOrderAPIView,
    update_location,
    latest_location,
    update_order_status
)


# Router for ViewSets
router = DefaultRouter()
router.register(r"meals", MealViewSet, basename="meal")
router.register(r"additional-meals", AdditionalMealViewSet, basename="additionalmeal")
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'advertisements', AdvertisementViewSet, basename='advertisement')
router.register(r'orders', OrderViewSet)

urlpatterns = [
    # Auth endpoints
    path("auth/", include("dj_rest_auth.urls")),
    path("auth/registration/", include("dj_rest_auth.registration.urls")),
    path("auth/google/", GoogleLoginAPIView.as_view(), name="google-login"),

    # Router endpoints
    path("", include(router.urls)),

    # Custom endpoints
    path("meals/available/", MealListAPIView.as_view(), name="available-meal-list"),
    # path("meals/available/id/", MealListAPIView.as_view(), name="available-meal-detail"),
    path("user-count/", user_count, name="user-count"),
    path('active-orders/', ActiveOrderAPIView.as_view(), name='active-orders'),
    path('place-order/', PlaceOrderAPIView.as_view(), name='place-order'),  # Fixed this line
    path("set-order-time-status/", set_order_time_status, name="set-order-time-status"),
    path("get-order-time-status/", get_order_time_status, name="get-order-time-status"),

    # Delivery location endpoints (remove 'api/' prefix here)
    path('delivery-location/update/', update_location, name='update_location'),
    path('delivery-location/latest/', latest_location, name='latest_location'),

    # For update status
    path('api/orders/<int:order_id>/update-status/', update_order_status, name='update_order_status'),
]

    # path('delivery-location/update/', update_location, name='update_location'),
    # path('delivery-location/latest/', latest_location, name='latest_location'),