from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib import auth, messages
from django.contrib.auth import views as django_views
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponseRedirect
from django.shortcuts import get_object_or_404, redirect, render
from django.template.response import TemplateResponse
from django.urls import reverse, reverse_lazy
from django.utils.translation import pgettext, ugettext_lazy as _
from django.views.decorators.http import require_POST
from django.contrib.auth import authenticate, login
from django.http import HttpResponse
from django.http import JsonResponse
from django.template import RequestContext
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

from .tokens import account_activation_token
from .utils import getAccountRank
from ..app.models import Link
from .models import User
from .forms import (
    LoginForm, SignUpForm)


def signin(request):
    kwargs = {
        'template_name': 'registration/login.html',
        'authentication_form': LoginForm}
    return django_views.LoginView.as_view(**kwargs)(request, **kwargs)


def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False
            user.save()
            current_site = get_current_site(request)
            subject = 'Activate Your SwapHub Account'
            message = render_to_string('registration/account_activation_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': force_text(urlsafe_base64_encode(force_bytes(user.pk))),
                'token': account_activation_token.make_token(user),
            })
            user.email_user(subject, message)
            return redirect('/account_activation_sent')
    else:
        form = SignUpForm()
    return render(request, 'registration/signup.html', {'form': form})

def account_activation_sent(request):
    return render(request, 'registration/account_activation_sent.html')


def activate(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.profile.email_confirmed = True
        user.save()
        login(request, user)
        return redirect('/dashboard')
    else:
        return render(request, 'registration/account_activation_invalid.html')

@login_required
def logout(request):
    auth.logout(request)
    return redirect(settings.LOGOUT_REDIRECT_URL)


@login_required
def account(request):
    rank = getAccountRank(request.user.rank)
    links = request.user.links.all()
    totalView = 0
    totalTime = 0
    for val in links:
        totalView = totalView + val.view
        totalTime = totalTime + val.time
    ctx = {'links': links,
    'onglet': 'account',
    'totalView': totalView,
    'totalTime': totalTime,
    'rank': rank
    }
    return TemplateResponse(request, 'app/account.html', ctx)


@login_required
def addLink(request):
    name = request.POST.get('name', None)
    url = request.POST.get('url', None)
    link = Link(name=name,url=url,user_id=request.user)
    link.save()
    return JsonResponse(link.id, safe=False)


@login_required
def editLink(request):
    link = Link.objects.get(pk=request.POST.get('linkId', None))
    link.name = request.POST.get('name', None)
    link.url = request.POST.get('url', None)
    link.save()
    return JsonResponse(link.id, safe=False)


@login_required
def deleteLink(request):
    Link.objects.get(pk=request.POST.get('linkId', None)).delete()
    return JsonResponse('ok', safe=False)


@login_required
def activeLink(request):
    if request.POST.get('active', None) == 'true':
        is_active = True
    else:
        is_active = False
    link = Link.objects.get(pk=request.POST.get('linkId', None))
    link.active = is_active
    link.save()
    return JsonResponse('ok', safe=False)


@login_required
def setUserMaxVisits(request):
    visits = int('0' + request.POST.get('value', None))
    request.user.maxVisits = visits
    request.user.save()
    return JsonResponse('ok', safe=False)


@login_required
def deleteAccount(request):
    request.user.delete()
    return JsonResponse('ok', safe=False)