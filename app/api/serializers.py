from app.core.models import Source, Prediction, Realisation
from rest_framework import serializers

class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source

class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction

class RealisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Realisation