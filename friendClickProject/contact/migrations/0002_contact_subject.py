# Generated by Django 2.0.7 on 2018-07-28 09:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contact', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='contact',
            name='subject',
            field=models.TextField(default='sujet'),
        ),
    ]
