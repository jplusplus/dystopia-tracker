from django.shortcuts import render_to_response
from django.template  import RequestContext
from app.core.models  import Prediction
from django.conf      import settings

def __get_default_meta():
    meta = dict()
    meta['title'] = 'Dystopia Tracker'
    meta['description'] = 'Explore and contribute predictions about the future and their realisations.'
    meta['image'] = 'http://www.dystopiatracker.com/static/img/screenshot.png'
    meta['pagetype'] = 'article'
    return meta

def home(request, *kargs, **kwargs):
    return render_to_response('home.dj.html', __get_default_meta(), context_instance=RequestContext(request))

def details(request, *kargs, **kwargs):
    meta = __get_default_meta()

    prediction = Prediction.objects.get(pk=kwargs['id'])
    if (prediction):
        source = prediction.source

        # title should be prediction headline (or source title if not defined)
        headline = getattr(prediction, "headline_{0}".format(kwargs['lang'])).encode('utf-8')
        if (headline):
            meta['title'] = "{0} | {1}".format(headline, meta['title']).encode('utf-8')
        else:
            meta['title'] = "{0} | {1}".format(getattr(source, "title_{0}".format(kwargs['lang']).encode('utf-8')), meta['title'])

        # image should be prediction image (or source image if not defined (or default image if not defined))
        image = getattr(prediction, "image") or getattr(source, "image")
        if (image):
            meta['image'] = "{0}{1}{2}".format(settings.STATIC_URL, settings.MEDIA_URL, image)

        # description should be the prediction description
        if (kwargs['lang'] == 'E'):
            meta['description'] = "Explore dystopian predictions and their realisations. Like this one: {0}".format(getattr(prediction, 'description_E').encode('utf-8'))
        elif (kwargs['lang'] == 'D'):
            meta['description'] = "Erkunden Sie dystopische Vorhersagen und ihre Realisierungen - wie diese: {0}".format(getattr(prediction, 'description_D').encode('utf-8'))

    return render_to_response('home.dj.html', meta, context_instance=RequestContext(request))

def partial(request, partial_name=None):
    template_name = 'partials/' + partial_name + '.dj.html'
    try:
        return render_to_response(template_name, context_instance=RequestContext(request))
    except TemplateDoesNotExist:
        raise Http404