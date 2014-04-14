from app.core.models import Prediction, Source
import django_filters
from django.db.models import Q

class PredictionFilter(django_filters.FilterSet):
    # Define filter functions
    def _lang(queryset, value):
        if not value:
            return queryset
        if value in ['E', 'D']:
            _filter = { 'description_{0}'.format(value) : "" }
            return queryset.filter(~Q(**_filter))
        else:
            return queryset.none()

    def _exclude_id(queryset, id):
        return queryset.filter(~Q(id = id))

    def _img_defined(queryset, value):
        if value:
            return queryset.filter(~Q(image = ""))
        else:
            return queryset

    def _published(queryset, value):
        if value or value == None:
            return queryset.filter(published=True)
        else:
            return queryset.filter(published=False)

    def _source_title(queryset, value):
        return queryset.filter(source__title_E__contains=value, source__title_D__contains=value)

    # Define custom filters
    lang = django_filters.CharFilter(action=_lang)
    title = django_filters.CharFilter(action=_source_title)
    author = django_filters.CharFilter(name='source__author')
    exclude = django_filters.NumberFilter(action=_exclude_id)
    img = django_filters.BooleanFilter(action=_img_defined)
    published = django_filters.BooleanFilter(action=_published)

    class Meta:
        model = Prediction
        fields = ['lang', 'editors_pick', 'source__type', 'category', 'title',
                  'author', 'exclude', 'published']

class SourceFilter(django_filters.FilterSet):
    class Meta:
        model = Source
        fields = ['type']