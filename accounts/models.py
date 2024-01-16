from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User


class Account(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=255, blank=True)
    content = models.TextField(blank=True)
    image = models.ImageField(
        # Cloudinary Account image (Default)
        upload_to='images/',
        default='../account_default_lhrxjr'
    )

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.owner}'s account"


def create_account(sender, instance, created, **kwargs):
    if created:
        Account.objects.create(owner=instance)


post_save.connect(create_account, sender=User)
