from django.conf.urls import patterns, include, url
from django.conf import settings

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'app.views.home', name='home'),
    url(r'^[A-Z]{1}/$', 'app.views.home'),

    url(r'^[A-Z]{1}/p/(?P<author>([a-z0-9_\-/\.]+))/(?P<title>([a-z0-9_\-/\.]+))/(?P<id>([0-9]+))$', 'app.views.home', name='details'),

    url(r'^[A-Z]{1}/submit/prediction', 'app.views.home', name='submit-prediction'),
    url(r'^[A-Z]{1}/submit/realisation', 'app.views.home', name='submit-realisation'),

    url(r'^partial/(?P<partial_name>([a-zA-Z0-9_\-/\.]+))\.html$', 'app.views.partial', name='partial'),

    url(r'^api/',       include('app.api.urls')),

    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/',     include(admin.site.urls)),
)

urlpatterns += patterns('',
    (r'^uploaded/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
)