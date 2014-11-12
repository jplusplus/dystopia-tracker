from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from app.core.models import Category, Source, Prediction, Realisation
from app.core.resources import SourceResource, PredictionResource, RealisationResource, CategoryResource

class CategoryAdmin(ImportExportModelAdmin):
    resource_class = CategoryResource
    search_fields = ('title_D', 'title_E', 'title_F')
    list_display = ('id', 'title_E', 'title_E', 'title_F', 'color')
admin.site.register(Category, CategoryAdmin)

class SourceAdmin(ImportExportModelAdmin):
    resource_class = SourceResource
    search_fields = ('title_E', 'title_D', 'title_F', 'author', 'year_published', 'description_E', 'description_D', 'description_F')
    list_display = ('id', 'title_E', 'author', 'year_published', 'type', 'image')
    list_filter = ('featured', 'type')
admin.site.register(Source, SourceAdmin)

class PredictionAdmin(ImportExportModelAdmin):
    resource_class = PredictionResource
    search_fields = ('source__title_E', 'source__title_D', 'source__author', 'source__year_published', 'year_predicted', 'username', 'category__title_E', 'category__title_D', 'description_E', 'description_D')
    list_display = ('id', 'headline_E', 'description_E', 'year_predicted', 'source', 'category', 'username', 'creation_date', 'image', )
    list_filter = ('published', 'editors_pick', 'category', 'source')
admin.site.register(Prediction, PredictionAdmin)

class RealisationAdmin(ImportExportModelAdmin):
    resource_class = RealisationResource
    search_fields = ('description_E', 'description_D', 'year_introduced', 'prediction__year_predicted', 'prediction__source__title', 'prediction__source__author', 'username')
    list_display = ('id', 'description_E', 'prediction', 'username', 'creation_date')
    list_filter = ('published',)
admin.site.register(Realisation, RealisationAdmin)