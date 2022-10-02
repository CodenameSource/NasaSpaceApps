from django.contrib.auth.models import User
from csvdata.models import SeismicEvent

from rest_framework import viewsets
from rest_framework import permissions
from csvdata.serializers import UserSerializer, SeismicEventSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class SeismicEventViewSet(viewsets.ModelViewSet):
    queryset = SeismicEvent.objects.all().order_by('date')
    serializer_class = SeismicEventSerializer
    #permission_classes = []