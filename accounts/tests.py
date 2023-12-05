from django.test import TestCase
from django.contrib.auth.models import User
from .models import Account
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse


# ----- Tests written after imlementing code (NOT TDD) -----

# ------- MODEL TESTS ------- #

class AccountModelTest(TestCase):

    def setUp(self):
        # Create an User that automaticly creates an Account-object
        self.user = User.objects.create_user(
            'testuser', 'test@mail.com', 'testpassword'
        )
        self.account = Account.objects.get(owner=self.user)

    def test_account_creation(self):
        self.assertEqual(self.account.owner, self.user)

    def test_account_string_representation(self):
        self.assertEqual(str(self.account), f"{self.user}'s account")

# ------- END OF MODEL TESTS ------- #