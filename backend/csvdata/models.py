from django.db import models


class SeismicEvent(models.Model):
    type = models.CharField(max_length=10, null=True)
    lat = models.FloatField()
    long = models.FloatField()
    depth = models.SmallIntegerField(null=True)
    date = models.DateTimeField()

