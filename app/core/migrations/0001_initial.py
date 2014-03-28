# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Category'
        db.create_table(u'core_category', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=75)),
        ))
        db.send_create_signal(u'core', ['Category'])

        # Adding model 'Source'
        db.create_table(u'core_source', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('type', self.gf('django.db.models.fields.CharField')(max_length=20)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=75)),
            ('author', self.gf('django.db.models.fields.CharField')(max_length=75)),
            ('year_published', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('more_info', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
            ('series_season', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('series_episode', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('description_E', self.gf('django.db.models.fields.TextField')(max_length=300)),
            ('description_D', self.gf('django.db.models.fields.TextField')(max_length=300)),
            ('image', self.gf('django.db.models.fields.files.ImageField')(max_length=100, blank=True)),
            ('image_credit', self.gf('django.db.models.fields.CharField')(max_length=75, blank=True)),
        ))
        db.send_create_signal(u'core', ['Source'])

        # Adding model 'Prediction'
        db.create_table(u'core_prediction', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('source', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['core.Source'])),
            ('category', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['core.Category'])),
            ('description_E', self.gf('django.db.models.fields.TextField')(max_length=300)),
            ('description_D', self.gf('django.db.models.fields.TextField')(max_length=300)),
            ('year_predicted', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('more_info', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
            ('headline_E', self.gf('django.db.models.fields.TextField')(max_length=300)),
            ('headline_D', self.gf('django.db.models.fields.TextField')(max_length=300)),
            ('image', self.gf('django.db.models.fields.files.ImageField')(max_length=100, blank=True)),
            ('image_credit', self.gf('django.db.models.fields.CharField')(max_length=75, blank=True)),
            ('username', self.gf('django.db.models.fields.CharField')(max_length=75)),
            ('creation_date', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('edition_date', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('published', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal(u'core', ['Prediction'])

        # Adding model 'Realisation'
        db.create_table(u'core_realisation', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('prediction', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['core.Prediction'])),
            ('description_E', self.gf('django.db.models.fields.TextField')(max_length=300)),
            ('description_D', self.gf('django.db.models.fields.TextField')(max_length=300)),
            ('year_introduced', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('more_info', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
            ('image', self.gf('django.db.models.fields.files.ImageField')(max_length=100, blank=True)),
            ('image_credit', self.gf('django.db.models.fields.CharField')(max_length=75, blank=True)),
            ('creation_date', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('edition_date', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('published', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal(u'core', ['Realisation'])


    def backwards(self, orm):
        # Deleting model 'Category'
        db.delete_table(u'core_category')

        # Deleting model 'Source'
        db.delete_table(u'core_source')

        # Deleting model 'Prediction'
        db.delete_table(u'core_prediction')

        # Deleting model 'Realisation'
        db.delete_table(u'core_realisation')


    models = {
        u'core.category': {
            'Meta': {'object_name': 'Category'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '75'})
        },
        u'core.prediction': {
            'Meta': {'object_name': 'Prediction'},
            'category': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['core.Category']"}),
            'creation_date': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'description_D': ('django.db.models.fields.TextField', [], {'max_length': '300'}),
            'description_E': ('django.db.models.fields.TextField', [], {'max_length': '300'}),
            'edition_date': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'headline_D': ('django.db.models.fields.TextField', [], {'max_length': '300'}),
            'headline_E': ('django.db.models.fields.TextField', [], {'max_length': '300'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'image_credit': ('django.db.models.fields.CharField', [], {'max_length': '75', 'blank': 'True'}),
            'more_info': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'published': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'source': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['core.Source']"}),
            'username': ('django.db.models.fields.CharField', [], {'max_length': '75'}),
            'year_predicted': ('django.db.models.fields.PositiveIntegerField', [], {})
        },
        u'core.realisation': {
            'Meta': {'object_name': 'Realisation'},
            'creation_date': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'description_D': ('django.db.models.fields.TextField', [], {'max_length': '300'}),
            'description_E': ('django.db.models.fields.TextField', [], {'max_length': '300'}),
            'edition_date': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'image_credit': ('django.db.models.fields.CharField', [], {'max_length': '75', 'blank': 'True'}),
            'more_info': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'prediction': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['core.Prediction']"}),
            'published': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'year_introduced': ('django.db.models.fields.PositiveIntegerField', [], {})
        },
        u'core.source': {
            'Meta': {'object_name': 'Source'},
            'author': ('django.db.models.fields.CharField', [], {'max_length': '75'}),
            'description_D': ('django.db.models.fields.TextField', [], {'max_length': '300'}),
            'description_E': ('django.db.models.fields.TextField', [], {'max_length': '300'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'image_credit': ('django.db.models.fields.CharField', [], {'max_length': '75', 'blank': 'True'}),
            'more_info': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'series_episode': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'series_season': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '75'}),
            'type': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'year_published': ('django.db.models.fields.PositiveIntegerField', [], {})
        }
    }

    complete_apps = ['core']