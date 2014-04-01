from app.core.models import Source, Prediction, Realisation, Category
from rest_framework import generics, permissions, filters
from app.api.serializers import SourceSerializer, PredictionSerializer, RealisationSerializer, CategorySerializer
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

class SourceDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Source
    serializer_class = SourceSerializer
    permission_classes = [
        permissions.AllowAny
    ]

class CategoryList(generics.ListAPIView):
    model = Category
    serializer_class = CategorySerializer
    permission_classes = [
        permissions.AllowAny
    ]