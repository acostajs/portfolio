from django.db import models
from django.utils.text import slugify


class Technology(models.Model):
    name = models.CharField(max_length=100)
    url = models.URLField(blank=True)


class Project(models.Model):
    title = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    short_description = models.CharField(max_length=400)
    technologies = models.ManyToManyField(Technology)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    role = models.CharField(max_length=50)
    features = models.CharField(max_length=100)
    challenges = models.TextField(blank=True)
    project_type = models.CharField(max_length=100)
    live_demo_url = models.URLField(blank=True)
    source_code_url = models.URLField(blank=True)
    screenshot_01 = models.ImageField(
        upload_to="project_screenshots/", blank=True, null=True
    )
    screenshot_02 = models.ImageField(
        upload_to="project_screenshots/", blank=True, null=True
    )
    screenshot_03 = models.ImageField(
        upload_to="project_screenshots/", blank=True, null=True
    )
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
