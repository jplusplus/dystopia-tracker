from django.db import models
from django.utils.translation import ugettext_lazy as _

class Category(models.Model):
    title = models.CharField(max_length=75)

    def __unicode__(self):
        return self.title

SOURCE_TYPES = (
    ('literature', _('Literature')),
    ('movies', _('Movies')),
    ('tv_series', _('TV series')),
    ('games', _('Games')),
    ('other', _('Other')),
)

class Source(models.Model):
    type = models.CharField(max_length=20, choices=SOURCE_TYPES)

    title = models.CharField(max_length=75)

    author = models.CharField(max_length=75)

    year_published = models.PositiveIntegerField()

    more_info = models.URLField(blank=True)

    series_season = models.PositiveIntegerField(blank=True, null=True)
    series_episode = models.PositiveIntegerField(blank=True, null=True)

    description_E = models.TextField(max_length=300, blank=True)
    description_D = models.TextField(max_length=300, blank=True)

    image = models.ImageField(upload_to='uploaded/sources', blank=True)
    image_credit = models.CharField(max_length=75, blank=True)

    def __unicode__(self):
        return '%s by %s (%d)' % (self.title, self.author, self.id)

class Prediction(models.Model):
    source = models.ForeignKey(Source)

    category = models.ForeignKey(Category)

    description_E = models.TextField(max_length=300, blank=True)
    description_D = models.TextField(max_length=300, blank=True)

    year_predicted = models.PositiveIntegerField(blank=True)

    more_info = models.URLField(blank=True)

    headline_E = models.TextField(max_length=300, blank=True)
    headline_D = models.TextField(max_length=300, blank=True)

    image = models.ImageField(upload_to='uploaded/predictions', blank=True)
    image_credit = models.CharField(max_length=75, blank=True)

    username = models.CharField(max_length=75, blank=True)

    creation_date = models.DateTimeField(auto_now_add=True)
    edition_date = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=False)

    def __unicode__(self):
        if self.headline_E != None and self.headline_E != "":
            return self.headline_E
        return '%d : %s by %s (%d)' % (self.year_predicted, self.source.title, self.source.author, self.id)

class Realisation(models.Model):
    prediction = models.ForeignKey(Prediction)

    description_E = models.TextField(max_length=300, blank=True)
    description_D = models.TextField(max_length=300, blank=True)

    year_introduced = models.PositiveIntegerField()

    more_info = models.URLField(blank=True)

    image = models.ImageField(upload_to='uploaded/realisations', blank=True)
    image_credit = models.CharField(max_length=75, blank=True)

    username = models.CharField(max_length=75, blank=True)

    creation_date = models.DateTimeField(auto_now_add=True)
    edition_date = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=False)