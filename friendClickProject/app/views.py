from django.conf import settings
from django.contrib import auth, messages
from django.contrib.auth import views as django_views
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponseRedirect, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect
from django.template.response import TemplateResponse
from django.urls import reverse, reverse_lazy
from django.utils.translation import pgettext, ugettext_lazy as _
from django.views.decorators.http import require_POST
from django.contrib.auth import authenticate, login
from django.template import RequestContext
from django.db.models import Q
from pprint import pprint
from django.db.models import Count
import datetime
from datetime import timedelta, time
from django.db.models import Max, Min

from .models import Link
from .models import Click
from .models import Report
from ..account.models import User
from .utils import addUserClick, getDashboard


def index(request):
    return TemplateResponse(request, 'app/index.html')

def terms(request):
    return TemplateResponse(request, 'app/terms.html')

@login_required
def dashboard(request):
	obj = getDashboard(request)

	ctx = {'links':obj.links,
	'onglet':'dashboard',
	'totalView': obj.totalView,
	'totalTime': obj.totalTime
	}
	return TemplateResponse(request, 'app/dashboard.html', ctx)

@login_required
def addClick(request):
	addUserClick(request)
	return JsonResponse('ok', safe=False)

@login_required
def reportLink(request):
	if Report.objects.filter(link_id=Link.objects.get(pk=request.POST.get('link', None)),user_id=request.user).exists():
		return JsonResponse('false', safe=False)
	else:
		report = Report(description=request.POST.get('message', None),link_id=Link.objects.get(pk=request.POST.get('link', None)),user_id=request.user)
		report.save()
		return JsonResponse('true', safe=False)


@login_required
def donate(request):
    return TemplateResponse(request, 'app/donate.html', {'onglet': 'donate'})