from django.core.mail import send_mail, BadHeaderError
from django.conf import settings
from django.contrib import auth, messages
from django.contrib.auth import views as django_views
from django.contrib.auth import REDIRECT_FIELD_NAME
from django.db.models import Q, Sum
from django.template.response import TemplateResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.shortcuts import get_object_or_404, redirect, render
from django.http import Http404, HttpResponseRedirect, HttpResponse
from .forms import (
    ContactForm
)

from .models import Contact


@login_required
def contact(request):
	if request.method == 'GET':
		form = ContactForm()
	else:
		form = ContactForm(request.POST)
		if form.is_valid():
			subject = form.cleaned_data['subject']
			from_email = request.user.email
			message = form.cleaned_data['message']
			try:
				contact = Contact(user_id=request.user,message=message,subject=subject)
				contact.save();
				send_mail(subject, message, from_email, ['admin@example.com'])
			except BadHeaderError:
				return HttpResponse('Invalid header found.')
			return redirect('/success')
	return render(request, "app/contact.html", {'form': form, 'onglet': 'contact'})

@login_required
def success(request):
    return HttpResponse('Success! Thank you for your message.')