# Generated by Django 4.1.1 on 2022-10-02 10:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('csvdata', '0002_alter_seismicevent_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='seismicevent',
            name='date',
            field=models.DateTimeField(),
        ),
    ]