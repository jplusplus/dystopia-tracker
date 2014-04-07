from import_export import resources
from app.core.models import Source, Prediction, Realisation

class SourceResource(resources.ModelResource):
    class Meta:
        model = Source
        exclude = ()

class PredictionResource(resources.ModelResource):
    class Meta:
        model = Prediction
        exclude = ()

class RealisationResource(resources.ModelResource):
    class Meta:
        model = Realisation
        exclude = ()