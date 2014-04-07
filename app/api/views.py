from app.core.models import Source, Prediction, Realisation, Category
from rest_framework import generics, permissions, filters
from app.api.serializers import SourceSerializer, PredictionSerializer, RealisationSerializer, CategorySerializer
from app.api.serializers import PredictionCreationSerializer
import app.api.filters

class PredictionList(generics.ListCreateAPIView):
    queryset = Prediction.objects.all().order_by('-creation_date')
    serializer_class = PredictionSerializer
    permission_classes = [
        permissions.AllowAny
    ]
    filter_class = app.api.filters.PredictionFilter

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PredictionSerializer
        else:
            return PredictionCreationSerializer

class PredictionDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Prediction
    serializer_class = PredictionSerializer
    permission_classes = [
        permissions.AllowAny
    ]
    filter_class = app.api.filters.PredictionFilter

class SourceList(generics.ListCreateAPIView):
    model = Source
    serializer_class = SourceSerializer
    permission_classes = [
        permissions.AllowAny
    ]
    filter_class = app.api.filters.SourceFilter

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

class CategoryDetail(generics.RetrieveAPIView):
    model = Category
    serializer_class = CategorySerializer
    permission_classes = [
        permissions.AllowAny
    ]

class RealisationCreate(generics.CreateAPIView):
    model = Realisation
    serializer_class = RealisationSerializer
    permission_classes = [
        permissions.AllowAny
    ]