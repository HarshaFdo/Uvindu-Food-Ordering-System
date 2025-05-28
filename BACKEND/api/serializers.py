from rest_framework import serializers
from .models import Meal, Notification, Advertisement, AdditionalMeal, Order



from .models import Meal
from .models import AdditionalMeal
from .models import Order, PlaceOrder


class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = '__all__'

class AdditionalMealSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdditionalMeal
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['order_number', 'items', 'eta', 'status']

        
        
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class AdvertisementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertisement



class PlaceOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceOrder
        fields = '__all__'