from django.conf import settings
from django.contrib import auth, messages
from django.contrib.auth import views as django_views
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponseRedirect
from django.shortcuts import get_object_or_404, redirect
from django.template.response import TemplateResponse
from django.urls import reverse, reverse_lazy
from django.utils.translation import pgettext, ugettext_lazy as _
from django.views.decorators.http import require_POST
from django.contrib.auth import authenticate, login
from django.http import HttpResponse
from django.http import JsonResponse
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


def index(request):
    return TemplateResponse(request, 'app/index.html')

def terms(request):
    return TemplateResponse(request, 'app/terms.html')

@login_required
def dashboard(request):
	today = datetime.datetime.now().date()
	tomorrow = today + timedelta(1)
	today_start = datetime.datetime.combine(today, time())
	today_end = datetime.datetime.combine(tomorrow, time())

	created_time = datetime.datetime.now() - datetime.timedelta(minutes=30)
	linksClicked = Link.objects.filter(clicks__user_id=request.user, clicks__created_on__gt=created_time)
	links = Link.objects.all()
	totalView = 0
	totalTime = 0

	for val in links:
		totalView = totalView + val.view
		totalTime = totalTime + val.time

	links = Link.objects.filter(active=True,user_id__points__gt=0).exclude(id__in=request.user.links.all()).exclude(id__in=linksClicked.all()).order_by('user_id__points')

	for utilisateur in User.objects.all():
		utilisateurClicks = Click.objects.filter(link_id__user_id=utilisateur,created_on__lte=today_end,created_on__gte=today_start)
		if len(utilisateurClicks) >= utilisateur.maxVisits:
			links = links.exclude(id__in=utilisateur.links.all())

	ctx = {'links':links,
	'onglet':'dashboard',
	'totalView': totalView,
	'totalTime': totalTime
	}
	return TemplateResponse(request, 'app/dashboard.html', ctx)

@login_required
def addClick(request):
	time = int('0' + request.POST.get('time', None))
	points = int('0' + request.POST.get('points', None))
	subPoints = int(round(points/4))
	for val in request.POST.getlist('linksId[]', None):
		link = Link.objects.get(pk=val)
		click = Click(link_id=link,user_id=request.user,click_time=time)
		click.save()
		userPoints = link.user_id.points
		userRank = link.user_id.rank
		link.user_id.points = userPoints - subPoints
		link.user_id.rank = userRank + 50
		link.user_id.save()
		linkView = link.view
		link.view = linkView + 1
		linkTime = link.time
		link.time = linkTime + time
		link.save()

	userPoints = request.user.points
	userRank = request.user.rank
	request.user.points = userPoints + points
	request.user.rank = userRank + 100
	request.user.save()

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