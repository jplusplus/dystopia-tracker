from app.core.models import Source, Prediction, Realisation, Category
from rest_framework import serializers

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category

class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source

class RealisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Realisation

class PredictionSerializer(serializers.ModelSerializer):
    source = SourceSerializer()
    realisations = RealisationSerializer()
    category = CategorySerializer()

    class Meta:
        model = Prediction

class PredictionCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction