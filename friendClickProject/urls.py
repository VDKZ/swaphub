from django.conf import settings
from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib.sitemaps.views import sitemap
from django.contrib.staticfiles.views import serve

from .account.urls import urlpatterns as account_urls
from .app.urls import urlpatterns as app_urls
from .contact.urls import urlpatterns as contact_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^',include((account_urls, 'account'), namespace='account')),
    url(r'^',include((app_urls, 'app'), namespace='app')),
    url(r'^',include((contact_urls, 'contact'), namespace='contact')),
	url(r'^',include('django.contrib.auth.urls'))
]