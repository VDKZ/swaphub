from django.contrib.auth import views as django_views
from django.conf.urls import include, url

from . import views

urlpatterns = [
    url(r'^signin$', views.signin, name='signin'),
    url(r'^logout$', views.logout, name='logout'),
    url(r'^signup$', views.signup, name='signup'),
    url(r'^account$', views.account, name='account'),
    url(r'^addLink$', views.addLink, name='addLink'),
    url(r'^editLink$', views.editLink, name='editLink'),
    url(r'^deleteLink$', views.deleteLink, name='deleteLink'),
    url(r'^activeLink$', views.activeLink, name='activeLink'),
    url(r'^deleteAccount$', views.deleteAccount, name='deleteAccount'),
	url(r'^setUserMaxVisits$', views.setUserMaxVisits, name='setUserMaxVisits'),
	url(r'^account_activation_sent$', views.account_activation_sent, name='account_activation_sent'),
	url(r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',views.activate, name='activate'),
]