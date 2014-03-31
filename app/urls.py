from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'app.views.home', name='home'),

    url(r'^partial/(?P<partial_name>([a-zA-Z0-9_\-/\.]+))\.html$', 'app.views.partial', name='partial'),

    url(r'^api/',       include('app.api.urls')),

    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/',     include(admin.site.urls)),
)
