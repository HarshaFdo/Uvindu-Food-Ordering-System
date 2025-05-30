import requests
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets, permissions
from .models import Meal, Order
from .serializers import MealSerializer, OrderSerializer
from .models import AdditionalMeal, Notification, Advertisement
from .serializers import AdditionalMealSerializer, NotificationSerializer, AdvertisementSerializer
from .models import OrderingStatus
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated


class GoogleLoginAPIView(APIView):
    def post(self, request):
        token = request.data.get("token")
        print(token)

        try:
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request())
            email = idinfo["email"]
            name = idinfo.get("name", "")

            user, created = User.objects.get_or_create(
                username=email, defaults={"email": email, "first_name": name}
            )

            # Make user admin manually if needed (for testing/dev)

            admin_emails = ["sachintharoshan2021@gmail.com", "kusalnishan4@gmail.com", "aaharischandra6@gmail.com","wkwsamarasingha@std.appsc.sab.ac.lk","testingashan@gmail.com","lhsfernando@std.appsc.sab.ac.lk"]

            if email in admin_emails:   
                user.is_staff = True
                user.save()

            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": {
                        "email": user.email,
                        "name": user.first_name,
                        "is_staff": user.is_staff,
                    },
                }
            )

        except ValueError:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
            )


class MealViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Meal.objects.all()
    serializer_class = MealSerializer

class AdditionalMealViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = AdditionalMeal.objects.all()
    serializer_class = AdditionalMealSerializer

class MealListAPIView(APIView):
    # permission_classes = [IsAuthenticatedOrReadOnly]  # Optional: only logged users

    def get(self, request):
        meals = Meal.objects.filter(availability=True)
        serializer = MealSerializer(meals, many=True)
        return Response(serializer.data)

@api_view(['POST'])
def set_order_time_status(request):
    status = request.data.get('status', False)

    # Get or create single row
    status_obj, created = OrderingStatus.objects.get_or_create(id=1)
    status_obj.is_ordering_enabled = status
    status_obj.save()

    return Response({'success': True, 'status': status})

@api_view(['GET'])
def get_order_time_status(request):
    status_obj, created = OrderingStatus.objects.get_or_create(id=1)
    return Response({'status': status_obj.is_ordering_enabled})

@api_view(['GET'])
def user_count(request):
    count = User.objects.count()
    return Response({'user_count': count})


class ActiveOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user
        # Fetch the active order for this user
        active_order = Order.objects.filter(user=user, status='active').first()
        if not active_order:
            return Response({"detail": "No active order found."}, status=404)

        data = {
            "order_number": active_order.order_number,
            "order": active_order.description,  # or whatever field contains order details
            "eta": active_order.eta,
            "status": active_order.status,
        }
        return Response(data)
    

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


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def place_order(request):
    if request.method == "POST":
        # Your logic here to handle the order
        return JsonResponse({"message": "Order placed successfully"})
    else:
        return JsonResponse({"error": "Invalid HTTP method"}, status=405)

class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]