from rest_framework import serializers
from .models import Meal
from .models import AdditionalMeal

class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = '__all__'

class AdditionalMealSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdditionalMeal
        fields = '__all__'