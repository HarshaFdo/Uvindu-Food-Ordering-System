import requests
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework_simplejwt.tokens import RefreshToken

class GoogleLoginAPIView(APIView):
    def post(self, request):
        token = request.data.get("access_token")

        try:
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request())
            email = idinfo["email"]
            name = idinfo.get("name", "")
            
            user, created = User.objects.get_or_create(
                username=email, 
                defaults={"email": email, "first_name": name
                })
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'email': user.email,
                    'name': user.first_name,}
            })

        except ValueError:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


