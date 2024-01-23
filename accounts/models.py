from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User


#  Account model
class Account(models.Model):
    # Define one-to-one relationship with the User model
    owner = models.OneToOneField(User, on_delete=models.CASCADE)

    # Auto set the creation time of an account, when first created
    created_at = models.DateTimeField(auto_now_add=True)
    # Auto update the modification time of an account, every time saved
    updated_at = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=255, blank=True)
    # Optional content field, can be a longer text or blank
    content = models.TextField(blank=True)

    # Default image specified if no image is uploaded
    image = models.ImageField(
        upload_to='images/',
        default='../account_default_hhjogh'  # Default image path
    )

    # Meta class
    class Meta:
        # Default ordering by creation date in descending order
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.owner}'s account"


# Automatically creates an Account when a User is created
def create_account(sender, instance, created, **kwargs):
    if created:
        # Create an Account with the new User as the owner
        Account.objects.create(owner=instance)


# create_account will be called every time a User instance is saved
post_save.connect(create_account, sender=User)
