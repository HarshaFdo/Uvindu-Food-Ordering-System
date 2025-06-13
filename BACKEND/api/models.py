from django.db import models
from django.contrib.auth.models import User
from django.db import models
from decimal import Decimal

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


# for active order and past orders
class Order(models.Model):
    STATUS_CHOICES = [
        ('preparing', 'Preparing'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, default='Unknown')
    phone_number = models.CharField(max_length=20, default='Not Provided')
    hostel = models.CharField(max_length=100, default='Unknown')
    room_number = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='preparing')
    eta_minutes = models.IntegerField(default=30)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)


    def __str__(self):
        return f"Order {self.id} - {self.user.username}"
    
    def calculate_total_price(self):
        total = Decimal("0.00")
        for item in self.items.all():
            portion_price = (
                item.meal.half_price if item.portion == "half" else item.meal.full_price
            )

            additional_price = item.additional_meal.price if item.additional_meal else Decimal("0.00")

            total += (portion_price + additional_price) * item.quantity
        return total

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    meal = models.ForeignKey('Meal', on_delete=models.CASCADE)
    portion = models.CharField(max_length=20)
    additional_meal = models.ForeignKey('AdditionalMeal', null=True, blank=True, on_delete=models.SET_NULL)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quantity} x {self.meal.name}"

    
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

class PlaceOrder(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    hostel = models.CharField(max_length=100)
    room = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)

class DeliveryLocation(models.Model):
    latitude = models.FloatField(null=False, blank=False)
    longitude = models.FloatField(null=False, blank=False)
    updated_at = models.DateTimeField(auto_now=True)


