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

class PlaceOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceOrder
        fields = ['id', 'name', 'phone', 'hostel', 'room', 'created_at']
        read_only_fields = ['id', 'created_at']

class OrderItemSerializer(serializers.ModelSerializer):
    meal_name = serializers.CharField(source='meal.name', read_only=True)
    additional_meal_name = serializers.CharField(source='additional_meal.name', read_only=True, allow_null=True)
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'order', 'meal', 'meal_name', 'portion', 
            'additional_meal', 'additional_meal_name', 'quantity'
        ]
        read_only_fields = ['id']
        extra_kwargs = {
            'order': {'write_only': True}
        }

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    total_price = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        read_only=True
    )

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'name', 'phone_number', 'hostel', 'room_number',
            'created_at', 'is_active', 'items', 'total_price'
        ]
        read_only_fields = ['id', 'created_at', 'total_price']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        # Calculate total price
        order.save()  # This will trigger any post-save signals if needed
        return order

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Calculate total price for the order
        total = sum(
            (item.meal.full_price if item.portion == 'full' else item.meal.half_price) * item.quantity +
            (item.additional_meal.price if item.additional_meal else 0) * item.quantity
            for item in instance.items.all()
        )
        representation['total_price'] = str(total)
        return representation