from app.core.models import Source
from rest_framework import serializers

class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source