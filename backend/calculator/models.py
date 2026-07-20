from django.db import models


class CurrencyRate(models.Model):
    rates = models.JSONField()
    fetched_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rates as of {self.fetched_at}"