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
    realisations = serializers.SerializerMethodField('get_published_realisations')
    category = CategorySerializer()

    class Meta:
        model = Prediction

    def get_published_realisations(self, obj):
        realisations = obj.realisations.filter(published=True)
        serialized = RealisationSerializer(realisations)
        return serialized.data

class PredictionCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction