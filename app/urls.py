from django.conf.urls import patterns, include, url
from django.conf import settings

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'app.views.home', name='home'),
    url(r'^[A-Z]{1}/?$', 'app.views.home'),

    url(r'^(?P<lang>[A-Z]{1})/p/(?P<author>([a-z0-9_\-/\.]+))/(?P<title>([a-z0-9_\-/\.]+))/(?P<id>([0-9]+))/?$', 'app.views.details', name='details'),

    url(r'^[A-Z]{1}/submit/prediction', 'app.views.home', name='submit-prediction'),
    url(r'^[A-Z]{1}/submit/realisation', 'app.views.home', name='submit-realisation'),

    url(r'^[A-Z]{1}/thankyou', 'app.views.home', name='thankyou'),

    url(r'^[A-Z]{1}/p/(?P<author>([a-z0-9_\-/\.]+))/(?P<title>([a-z0-9_\-/\.]+))/(?P<id>([0-9]+))/embed$', 'app.views.home', name='embed'),

    url(r'^partial/(?P<partial_name>([a-zA-Z0-9_\-/\.]+))\.html$', 'app.views.partial', name='partial'),

    url(r'^[A-Z]{1}/timeline/?$', 'app.views.home'),

    url(r'^[A-Z]{1}/timeline/embed$', 'app.views.partial', name='timeline-embed'),

    url(r'^api/',       include('app.api.urls')),

    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/',     include(admin.site.urls)),
)

if settings.STAGING:
    urlpatterns += patterns('',
        (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
    )