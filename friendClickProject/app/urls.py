from django.conf.urls import url
from django.contrib.auth import views as django_views

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^terms$', views.terms, name='terms'),
    url(r'^dashboard$', views.dashboard, name='dashboard'),
    url(r'^addClick$', views.addClick, name='addClick'),
    url(r'^reportLink$', views.reportLink, name='reportLink'),
    url(r'^donate$', views.donate, name='donate')
]