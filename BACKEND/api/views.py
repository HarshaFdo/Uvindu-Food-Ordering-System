from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view,  permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework import status
from .models import Order

from .models import (
    Meal, AdditionalMeal, Notification, Advertisement,
    OrderingStatus, Order, DeliveryLocation
)
from .serializers import (
    MealSerializer, AdditionalMealSerializer, NotificationSerializer,
    AdvertisementSerializer, OrderSerializer, PlaceOrderSerializer
)

# Google Login
class GoogleLoginAPIView(APIView):
    def post(self, request):
        token = request.data.get("token")
        try:
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request())
            email = idinfo["email"]
            name = idinfo.get("name", "")

            user, created = User.objects.get_or_create(
                username=email, defaults={"email": email, "first_name": name}
            )

            admin_emails = [
                "sachintharoshan2021@gmail.com",
                "kusalnishan4@gmail.com",
                "aaharischandra6@gmail.com",
                "wkwsamarasingha@std.appsc.sab.ac.lk",
                "testingashan@gmail.com",
                "lhsfernando@std.appsc.sab.ac.lk"
            ]

            if email in admin_emails:
                user.is_staff = True
                user.save()

            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "email": user.email,
                    "name": user.first_name,
                    "is_staff": user.is_staff,
                },
            })

        except ValueError:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

# Meal Views
class MealViewSet(viewsets.ModelViewSet):
    queryset = Meal.objects.all()
    serializer_class = MealSerializer
    # def get_queryset(self):
    #     return Meal.objects.filter(availability=True)
    
class AdditionalMealViewSet(viewsets.ModelViewSet):
    queryset = AdditionalMeal.objects.all()
    serializer_class = AdditionalMealSerializer

    # def get_queryset(self):
    #     return AdditionalMeal.objects.filter(availability=True)

class MealListAPIView(APIView):
    def get(self, request):
        meals = Meal.objects.filter(availability=True)
        serializer = MealSerializer(meals, many=True)
        return Response(serializer.data)

# Order Time Status
@api_view(['POST'])
def set_order_time_status(request):
    status_flag = request.data.get('status', False)
    status_obj, _ = OrderingStatus.objects.get_or_create(id=1)
    status_obj.is_ordering_enabled = status_flag
    status_obj.save()
    return Response({'success': True, 'status': status_flag})

@api_view(['GET'])
def get_order_time_status(request):
    status_obj, _ = OrderingStatus.objects.get_or_create(id=1)
    return Response({'status': status_obj.is_ordering_enabled})

# User Count
@api_view(['GET'])
def user_count(request):
    count = User.objects.count()
    return Response({'user_count': count})

# Active Order for User
class ActiveOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        active_order = Order.objects.filter(user=user, status='active').first()
        if not active_order:
            return Response({"detail": "No active order found."}, status=404)

        return Response({
            "order_number": active_order.order_number,
            "order": active_order.description,
            "eta": active_order.eta,
            "status": active_order.status,
        })

# Notification & Advertisement Views
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class AdvertisementViewSet(viewsets.ModelViewSet):
    queryset = Advertisement.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = AdvertisementSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

# Orders
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.action == 'create' or self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=user).order_by('-created_at')


class PlaceOrderAPIView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        serializer = PlaceOrderSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Order placed successfully!"}, status=201)
        return Response(serializer.errors, status=400)

# Delivery Location
@csrf_exempt
@api_view(['POST'])
def update_location(request):
    lat = request.data.get('latitude')
    lon = request.data.get('longitude')

    if lat is None or lon is None:
        return Response({'error': 'Latitude and longitude required'}, status=400)

    loc, created = DeliveryLocation.objects.get_or_create(
        id=1, defaults={'latitude': lat, 'longitude': lon}
    )

    if not created:
        loc.latitude = lat
        loc.longitude = lon
        loc.save()

    return Response({'message': 'Location updated'})

@api_view(['GET'])
def latest_location(request):
    try:
        loc = DeliveryLocation.objects.get(id=1)
        return Response({'latitude': loc.latitude, 'longitude': loc.longitude})
    except DeliveryLocation.DoesNotExist:
        return Response({'error': 'No location found'}, status=404)

# For update ETA and status through admin dashboard
@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_order_status(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        status_val = request.data.get('status')
        eta_val = request.data.get('eta_minutes')

        if status_val:
            order.status = status_val
        if eta_val:
            order.eta_minutes = eta_val
        order.save()

        return Response({"message": "Order updated successfully."})
    except Order.DoesNotExist:
        return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
