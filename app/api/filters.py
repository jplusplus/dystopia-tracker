from app.core.models import Prediction
import django_filters
from django.db.models import Q

class PredictionFilter(django_filters.FilterSet):
    # Define filter functions
    def _lang(queryset, value):
        if not value:
            return queryset
        if value in ['E', 'D']:
            _filter = { 'description_{0}'.format(value) : "" }
            print _filter
            return queryset.filter(~Q(**_filter))
        else:
            return queryset.none()

    def _exclude_id(queryset, id):
        return queryset.filter(~Q(id = id))

    # Define custom filters
    lang = django_filters.CharFilter(action=_lang)
    title = django_filters.CharFilter(name='source__title')
    author = django_filters.CharFilter(name='source__author')
    exclude = django_filters.NumberFilter(action=_exclude_id)

    class Meta:
        model = Prediction
        fields = ['lang', 'editors_pick', 'category', 'title', 'author', 'exclude']