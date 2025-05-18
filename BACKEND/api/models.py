from django.db import models

class Meal(models.Model):
    name = models.CharField(max_length=100)
    half_price = models.DecimalField(max_digits=6, decimal_places=2)
    full_price = models.DecimalField(max_digits=6, decimal_places=2)
    availability = models.BooleanField(default=True)
    image = models.ImageField(upload_to='meals/', null=True, blank=True)

    def __str__(self):
        return self.name

