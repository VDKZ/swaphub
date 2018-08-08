import datetime
from django.conf import settings
from django.db import models

from ..account.models import User


class Link(models.Model):
	url = models.CharField(max_length=128)
	name = models.CharField(max_length=128)
	description = models.TextField()
	created_on  = models.DateTimeField(auto_now=True)
	active = models.BooleanField(default=False)
	deleted = models.BooleanField(default=False)
	view = models.IntegerField(default=0)
	time = models.IntegerField(default=0)
	user_id = models.ForeignKey(
        User, related_name='links', on_delete=models.CASCADE
	)
		

class Click(models.Model):
	click_time = models.IntegerField(default=0)
	created_on  = models.DateTimeField(auto_now=True)
	link_id = models.ForeignKey(
        Link, related_name='clicks', on_delete=models.CASCADE
	)
	user_id = models.ForeignKey(
        User, related_name='clicks', on_delete=models.CASCADE
	)
		
		
class Report(models.Model):
	description = models.TextField()
	created_on  = models.DateTimeField(auto_now=True)
	link_id = models.ForeignKey(
        Link, related_name='reports', on_delete=models.CASCADE
	)
	user_id = models.ForeignKey(
        User, related_name='reports', on_delete=models.CASCADE
	)
