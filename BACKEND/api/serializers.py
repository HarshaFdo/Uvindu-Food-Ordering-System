from rest_framework import serializers
from .models import (
    Meal, 
    Notification, 
    Advertisement, 
    AdditionalMeal, 
    Order,
    OrderItem,
    PlaceOrder
)

class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = ['id', 'name', 'half_price', 'full_price', 'availability', 'image']
        read_only_fields = ['id']

class AdditionalMealSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdditionalMeal
        fields = ['id', 'name', 'price', 'availability', 'image']
        read_only_fields = ['id']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'content', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class AdvertisementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertisement
        fields = ['id', 'title', 'subtitle', 'description', 'price', 'image', 
                 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

# Define OrderItemSerializer for reading/displaying orders
class OrderItemSerializer(serializers.ModelSerializer):
    meal = MealSerializer()  # include full meal details
    additional_meal = AdditionalMealSerializer()

    class Meta:
        model = OrderItem
        fields = '__all__'

# Define a separate serializer for creating order items (without the order field)
class OrderItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['meal', 'portion', 'additional_meal', 'quantity']

# OrderSerializer for reading/displaying orders
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = '__all__'

# PlaceOrderSerializer for creating new orders
class PlaceOrderSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True)  # Use the create serializer

    class Meta:
        model = Order
        fields = ['name', 'phone_number', 'hostel', 'room_number', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user

        order = Order.objects.create(user=user, **validated_data)

        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)

        return order