from rest_framework import serializers
from .models import Meal, Notification, Advertisement, AdditionalMeal, Order



from .models import Meal
from .models import AdditionalMeal
from .models import PlaceOrder
from .models import Meal, AdditionalMeal, Order, OrderItem


class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = '__all__'

class AdditionalMealSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdditionalMeal
        fields = '__all__'

               
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class AdvertisementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertisement
        fields = '__all__'

class PlaceOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceOrder
        fields = '__all__'

# for active order and past orders

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order
