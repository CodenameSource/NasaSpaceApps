from django.contrib.auth.models import User
from rest_framework import serializers
from csvdata.models import SeismicEvent


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email']


class SeismicEventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SeismicEvent
        fields = ['type', 'lat', 'long', 'depth', 'date']
        #read_only_fields = ['date']