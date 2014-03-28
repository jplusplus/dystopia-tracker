from django.conf.urls import patterns, url, include
from rest_framework import routers
from app.api import views

router = routers.DefaultRouter()
router.register(r'sources', views.SourceViewSet)

urlpatterns = patterns('',
    url(r'^', include(router.urls)),
)