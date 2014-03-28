from django.conf.urls import patterns, url, include
from rest_framework import routers
from app.api import views

router = routers.DefaultRouter()
router.register(r'sources', views.SourceViewSet)
router.register(r'predictions', views.PredictionViewSet)
router.register(r'realisation', views.RealisationViewSet)

urlpatterns = patterns('',
    url(r'^', include(router.urls)),
)