from settings import *
import dj_database_url

DATABASES = {
    'default' : dj_database_url.config()
}

ROOT_URLCONF = 'app.urls'

ALLOWED_HOSTS = [
    "dystopia-tracker.herokuapp.com",
    ".herokuapp.com"
]

AWS_ACCESS_KEY_ID          = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY      = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME    = os.getenv('AWS_STORAGE_BUCKET_NAME')
AWS_S3_FILE_OVERWRITE      = os.getenv('AWS_S3_FILE_OVERWRITE') == "True" and True or False

DEBUG = bool(os.getenv('DEBUG', 0))

LANGUAGE_CODE = os.getenv('LANGUAGE_CODE', 'fr')

STATIC_URL = os.getenv('STATIC_URL')

STATIC_ROOT = here('staticfiles')

STATICFILES_DIRS = (here('static'),)

INSTALLED_APPS            += ('storages',)

DEFAULT_FILE_STORAGE       = 'storages.backends.s3boto.S3BotoStorage'
STATICFILES_STORAGE        = DEFAULT_FILE_STORAGE

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
        'LOCATION': '/tmp/django_cache',
    }
}

COMPRESS_CSS_FILTERS = (
    "app.utils.CustomCssAbsoluteFilter",
    "compressor.filters.cssmin.CSSMinFilter",
    "compressor.filters.template.TemplateFilter",
)

COMPRESS_JS_FILTERS = (
    "compressor.filters.jsmin.JSMinFilter",
    "compressor.filters.template.TemplateFilter",
)

COMPRESS_TEMPLATE_FILTER_CONTEXT = {
    'STATIC_URL': STATIC_URL
}

COMPRESSOR_ROOT      = STATIC_ROOT
COMPRESSOR_URL       = STATIC_URL
COMPRESS_STORAGE     = STATICFILES_STORAGE
COMPRESS_ENABLED     = True
COMPRESS_OFFLINE     = True
AWS_QUERYSTRING_AUTH = False
