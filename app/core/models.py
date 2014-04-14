from django.db import models
from django.utils.translation import ugettext_lazy as _

class Category(models.Model):
    title_E = models.CharField(max_length=75)
    title_D = models.CharField(max_length=75)

    def __unicode__(self):
        return self.title_E

SOURCE_TYPES = (
    ('literature', _('Literature')),
    ('movies', _('Movies')),
    ('tv_series', _('TV series')),
    ('games', _('Games')),
    ('other', _('Other')),
)

class Source(models.Model):
    type = models.CharField(max_length=20, choices=SOURCE_TYPES)

    title_E = models.CharField(max_length=75, blank=True)
    title_D = models.CharField(max_length=75, blank=True)

    author = models.CharField(max_length=75, blank=True)

    year_published = models.PositiveIntegerField(blank=True)

    more_info = models.URLField(blank=True)

    series_season = models.PositiveIntegerField(blank=True, null=True)
    series_episode = models.PositiveIntegerField(blank=True, null=True)

    description_E = models.TextField(max_length=300, blank=True)
    description_D = models.TextField(max_length=300, blank=True)

    image = models.ImageField(upload_to='sources', blank=True)
    image_credit = models.CharField(max_length=75, blank=True)

    featured = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.year_published:
            self.year_published = 0
        super(Source, self).save(*args, **kwargs)

    def __unicode__(self):
        return '%s (%s, %d)' % (self.title_E, self.author, self.year_published)

class Prediction(models.Model):
    source = models.ForeignKey(Source)

    category = models.ForeignKey(Category, null=True, on_delete=models.SET_NULL)

    description_E = models.TextField(max_length=300, blank=True)
    description_D = models.TextField(max_length=300, blank=True)

    year_predicted = models.PositiveIntegerField(blank=True)

    more_info = models.URLField(blank=True)

    headline_E = models.TextField(max_length=300, blank=True)
    headline_D = models.TextField(max_length=300, blank=True)

    image = models.ImageField(upload_to='predictions', blank=True)
    image_credit = models.CharField(max_length=75, blank=True)

    username = models.CharField(max_length=75, blank=True)

    editors_pick = models.BooleanField(default=False)

    creation_date = models.DateTimeField(auto_now_add=True)
    edition_date = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.year_predicted:
            self.year_predicted = 0
        super(Prediction, self).save(*args, **kwargs)

    def __unicode__(self):
        if self.headline_E != None and self.headline_E != "":
            return self.headline_E
        return '%s : %s [%d]' % (self.source.title_E, self.description_E, self.id)

class Realisation(models.Model):
    prediction = models.ForeignKey(Prediction, related_name='realisations')

    description_E = models.TextField(max_length=300, blank=True)
    description_D = models.TextField(max_length=300, blank=True)

    year_introduced = models.PositiveIntegerField()

    more_info = models.URLField(blank=True)

    image = models.ImageField(upload_to='realisations', blank=True)
    image_credit = models.CharField(max_length=75, blank=True)

    username = models.CharField(max_length=75, blank=True)

    creation_date = models.DateTimeField(auto_now_add=True)
    edition_date = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=False)
    
    def __unicode__(self):
        return '%d: %s' % (self.year_introduced, self.description_E)