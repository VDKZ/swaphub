import datetime
from django.conf import settings
from django.db import models
from django.utils.text import slugify

from ..account.models import User


class Contact(models.Model):
	message = models.TextField()
	subject = models.TextField(default='sujet')
	created_on  = models.DateTimeField(auto_now=True)
	user_id = models.ForeignKey(
        User, related_name='contacts', on_delete=models.CASCADE
	)