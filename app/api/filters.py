from app.core.models import Prediction, Source
import django_filters
from django.db.models import Q

class PredictionFilter(django_filters.FilterSet):
    # Define filter functions
    def _lang(queryset, value):
        if not value:
            return queryset
        if value in ['E', 'D', 'F']:
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
        if value == '':
            return queryset
        return queryset.filter(Q(source__title_E=value) | Q(source__title_D=value) | Q(source__title_F=value))

    def _incomplete(queryset, value):
        if value is None:
            return queryset
        q = Q(source=None) | Q(category=None) | Q(year_predicted=0) | Q(more_info="") | \
            Q(description_E="") | Q(description_D="") | Q(description_F="") | \
            Q(headline_E="") | Q(headline_D="") | Q(headline_F="") | \
            Q(image="") | Q(image_credit="") | Q(username="")
        if value:
            queryset = queryset.filter(q)
        else:
            queryset = queryset.filter(~q)
        return queryset

    # Define custom filters
    lang = django_filters.CharFilter(action=_lang)
    title = django_filters.CharFilter(action=_source_title)
    author = django_filters.CharFilter(name='source__author')
    exclude = django_filters.NumberFilter(action=_exclude_id)
    img = django_filters.BooleanFilter(action=_img_defined)
    published = django_filters.BooleanFilter(action=_published)
    incomplete = django_filters.BooleanFilter(action=_incomplete)

    class Meta:
        model = Prediction
        fields = ['lang', 'editors_pick', 'source__type', 'category', 'title',
                  'author', 'exclude', 'published', 'incomplete']

class SourceFilter(django_filters.FilterSet):
    def _title(queryset, value):
        if value == '':
            return queryset
        return queryset.filter(Q(title_E=value) | Q(title_D=value) | Q(title_F=value))

    title = django_filters.CharFilter(action=_title)

    class Meta:
        model = Source
        fields = ['type', 'title']