from django.conf.urls import patterns, url, include
from rest_framework import routers
from app.api import views

prediction_urls = patterns('',
    url(r'^(?P<pk>\d+)$', views.PredictionDetail.as_view(), name='prediction-detail'),
    url(r'^$', views.PredictionList.as_view(), name='prediction-list')
)

sources_urls = patterns('',
    url(r'^$', views.SourceList.as_view(), name='sources-list')
)

categories_urls = patterns('',
    url(r'^$', views.CategoryList.as_view(), name='categories-list')
)

urlpatterns = patterns('',
    url(r'^categories/', include(categories_urls)),
    url(r'^predictions/', include(prediction_urls)),
    url(r'^sources/', include(sources_urls))
)
