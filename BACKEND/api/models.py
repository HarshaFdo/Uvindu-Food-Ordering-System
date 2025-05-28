from django.db import models
from django.contrib.auth.models import User

class Meal(models.Model):
    name = models.CharField(max_length=100)
    half_price = models.DecimalField(max_digits=6, decimal_places=2)
    full_price = models.DecimalField(max_digits=6, decimal_places=2)
    availability = models.BooleanField(default=True)
    image = models.ImageField(upload_to='meals/', null=True, blank=True)

    def __str__(self):
        return self.name

class AdditionalMeal(models.Model):
    name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    availability = models.BooleanField(default=True)
    image = models.ImageField(upload_to='additional_meals/', null=True, blank=True)

    def __str__(self):
        return self.name

from django.db import models

class OrderingStatus(models.Model):
    is_ordering_enabled = models.BooleanField(default=False)

    def __str__(self):
        return f"Ordering Enabled: {self.is_ordering_enabled}"



class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('preparing', 'Preparing'),
        ('on_the_way', 'On the Way'),
        ('delivered', 'Delivered'),
    ]

    order_number = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    items = models.TextField()  # Could be JSON if needed
    eta = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"#{self.order_number} - {self.status}"
    
class Notification(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Advertisement(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=200, default="No subtitle provided") 
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    image = models.ImageField(upload_to='ads/')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
<<<<<<< HEAD

class PlaceOrder(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    hostel = models.CharField(max_length=100)
    room = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)




=======
>>>>>>> f00fb542 (Updated Views.py to get notification and advertisements)
