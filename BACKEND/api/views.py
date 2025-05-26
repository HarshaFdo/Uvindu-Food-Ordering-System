import requests
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets
from .models import Meal
from .serializers import MealSerializer
from .models import AdditionalMeal
from .serializers import AdditionalMealSerializer
from rest_framework.permissions import IsAuthenticated

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
    queryset = Meal.objects.all()
    serializer_class = MealSerializer

class AdditionalMealViewSet(viewsets.ModelViewSet):
    queryset = AdditionalMeal.objects.all()
    serializer_class = AdditionalMealSerializer


class MealListAPIView(APIView):
    # permission_classes = [IsAuthenticatedOrReadOnly]  # Optional: only logged users

    def get(self, request):
        meals = Meal.objects.filter(availability=True)
        serializer = MealSerializer(meals, many=True)
        return Response(serializer.data)

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