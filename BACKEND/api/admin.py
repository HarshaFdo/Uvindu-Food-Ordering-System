from django.contrib import admin
from .models import Order, OrderItem

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'hostel', 'status', 'eta_minutes', 'is_active', 'created_at']
    list_filter = ['status', 'hostel', 'created_at']
    search_fields = ['user__username', 'hostel', 'room_number']
    readonly_fields = ['created_at']
    ordering = ['-created_at']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'meal', 'portion', 'quantity', 'additional_meal']
    list_filter = ['meal']
