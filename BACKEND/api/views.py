import requests
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets
from .models import Meal
from .serializers import MealSerializer

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
            admin_emails = ["sachintharoshan2021@gmail.com", "kusalnishan4@gmail.com", "aigavalakolanga@std.appsc.sab.ac.lk", "testingashan@gmail.com"]

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


class MealListAPIView(APIView):
    # permission_classes = [IsAuthenticatedOrReadOnly]  # Optional: only logged users

    def get(self, request):
        meals = Meal.objects.filter(availability=True)
        serializer = MealSerializer(meals, many=True)
        return Response(serializer.data)