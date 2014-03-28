from django.contrib import admin
from core.models import Category, Source, Prediction, Realisation

admin.site.register(Category)
admin.site.register(Source)
admin.site.register(Prediction)
admin.site.register(Realisation)