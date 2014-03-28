from app.core.models import Source
from rest_framework import viewsets
from app.api.serializers import SourceSerializer

class SourceViewSet(viewsets.ModelViewSet):
    queryset = Source.objects.all()
    serializer_class = SourceSerializer