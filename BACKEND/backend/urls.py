from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse  # make sure this is included

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path("", lambda request: HttpResponse("Welcome to the Uvindu Food Management System!")),
]
