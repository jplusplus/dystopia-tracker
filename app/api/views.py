from app.core.models import Source, Prediction, Realisation
from rest_framework import generics, permissions, filters
from app.api.serializers import SourceSerializer, PredictionSerializer, RealisationSerializer
import app.api.filters

class PredictionList(generics.ListAPIView):
    model = Prediction
    serializer_class = PredictionSerializer
    permission_classes = [
        permissions.AllowAny
    ]
    filter_class = app.api.filters.PredictionFilter

class PredictionDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Prediction
    serializer_class = PredictionSerializer
    permission_classes = [
        permissions.AllowAny
    ]
    filter_class = app.api.filters.PredictionFilter

class SourceList(generics.ListAPIView):
    model = Source
    serializer_class = SourceSerializer
    permission_classes = [
        permissions.AllowAny
    ]