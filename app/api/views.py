from app.core.models import Source, Prediction, Realisation
from rest_framework import viewsets, filters, generics
from app.api.serializers import SourceSerializer, PredictionSerializer, RealisationSerializer
import django_filters

class SourceViewSet(viewsets.ModelViewSet):
    queryset = Source.objects.all()
    serializer_class = SourceSerializer

class PredictionViewSet(viewsets.ModelViewSet):
    queryset = Prediction.objects.order_by('creation_date')
    serializer_class = PredictionSerializer

class RealisationViewSet(viewsets.ModelViewSet):
    queryset = Realisation.objects.all()
    serializer_class = RealisationSerializer