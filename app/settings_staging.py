from settings import *
import dj_database_url

DATABASES = {
    'default' : dj_database_url.config()
}

STAGING = True