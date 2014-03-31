from django.contrib import admin
from app.core.models import Category, Source, Prediction, Realisation

admin.site.register(Category)

admin.site.register(Source)

admin.site.register(Prediction)

admin.site.register(Realisation)