from django.shortcuts import render_to_response
from django.template  import RequestContext

def home(request):
    return render_to_response('home.dj.html', context_instance=RequestContext(request))

def partial(request, partial_name=None):
    template_name = 'partials/' + partial_name + '.dj.html'
    try:
        return render_to_response(template_name, context_instance=RequestContext(request))
    except TemplateDoesNotExist:
        raise Http404