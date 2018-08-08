from django.conf.urls import url
from django.contrib.auth import views as django_views

from . import views

urlpatterns = [
	url(r'^contact$', views.contact, name='contact'),
	url(r'^success$', views.success, name='success')
]