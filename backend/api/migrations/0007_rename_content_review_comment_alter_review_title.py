# Generated by Django 5.0.6 on 2024-09-16 21:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0006_review_isrecommended_review_title"),
    ]

    operations = [
        migrations.RenameField(
            model_name="review",
            old_name="content",
            new_name="comment",
        ),
        migrations.AlterField(
            model_name="review",
            name="title",
            field=models.CharField(default="title", max_length=120),
        ),
    ]
