from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from app.core.models import Category, Source, Prediction, Realisation
from app.core.resources import SourceResource, PredictionResource, RealisationResource

admin.site.register(Category)

class SourceAdmin(ImportExportModelAdmin):
    resource_class = SourceResource
    search_fields = ('title', 'author', 'year_published', 'description_E', 'description_D')
    list_display = ('type', 'title', 'author', 'year_published')
    list_filter = ('featured', 'type')
admin.site.register(Source, SourceAdmin)

class PredictionAdmin(ImportExportModelAdmin):
    resource_class = PredictionResource
    search_fields = ('source__title', 'source__author', 'source__year_published', 'year_predicted', 'username', 'category__title_E', 'category__title_D')
    list_display = ('headline_E', 'year_predicted', 'source', 'category', 'creation_date', 'username')
    list_filter = ('published', 'editors_pick', 'category')
admin.site.register(Prediction, PredictionAdmin)

class RealisationAdmin(ImportExportModelAdmin):
    resource_class = RealisationResource
    search_fields = ('description_E', 'description_D', 'year_introduced', 'prediction__year_predicted', 'prediction__source__title', 'prediction__source__author', 'username')
    list_display = ('prediction', 'creation_date', 'username')
    list_filter = ('published',)
admin.site.register(Realisation, RealisationAdmin)