from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from app.core.models import Category, Source, Prediction, Realisation
from app.core.resources import SourceResource, PredictionResource, RealisationResource

admin.site.register(Category)

class SourceAdmin(ImportExportModelAdmin):
    resource_class = SourceResource
admin.site.register(Source, SourceAdmin)

class PredictionAdmin(ImportExportModelAdmin):
    resource_class = PredictionResource
admin.site.register(Prediction, PredictionAdmin)

class RealisationAdmin(ImportExportModelAdmin):
    resource_class = RealisationResource
admin.site.register(Realisation, RealisationAdmin)