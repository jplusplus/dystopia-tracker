from app.core.models import Source, Prediction, Realisation
from rest_framework import serializers

class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source

class RealisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Realisation

class PredictionSerializer(serializers.ModelSerializer):
    source = SourceSerializer()
    realisations = RealisationSerializer()

    class Meta:
        model = Prediction