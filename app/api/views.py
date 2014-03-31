from app.core.models import Source, Prediction, Realisation
from rest_framework import generics, permissions, filters
from app.api.serializers import SourceSerializer, PredictionSerializer, RealisationSerializer
import django_filters
from django.db.models import Q

def lang(queryset, value):
    if not value:
        return queryset
    if value in ['E', 'D']:
        _filter = { 'description_{0}'.format(value) : "" }
        print _filter
        return queryset.filter(~Q(**_filter))
    else:
        return queryset.none()

def exclude_id(queryset, id):
    return queryset.filter(~Q(id = id))

class PredictionFilter(django_filters.FilterSet):
    lang = django_filters.CharFilter(action=lang)
    title = django_filters.CharFilter(name='source__title')
    author = django_filters.CharFilter(name='source__author')
    exclude = django_filters.NumberFilter(action=exclude_id)
    class Meta:
        model = Prediction
        fields = ['lang', 'editors_pick', 'category', 'title', 'author', 'exclude']

class PredictionList(generics.ListAPIView):
    model = Prediction
    serializer_class = PredictionSerializer
    permission_classes = [
        permissions.AllowAny
    ]
    filter_class = PredictionFilter

class PredictionDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Prediction
    serializer_class = PredictionSerializer
    permission_classes = [
        permissions.AllowAny
    ]
    filter_class = PredictionFilter