from django.test import TestCase
from django.contrib.auth.models import User
from .models import Account
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from .serializers import AccountSerializer


# ----- Tests written after imlementing code (NOT TDD) -----

# ------- MODEL TESTS ------- #

class AccountModelTest(TestCase):

    def setUp(self):
        # Create an User that automaticly creates an Account-object
        self.user = User.objects.create_user(
            'testuser', 'test@example.com', 'testpassword'
        )
        self.account = Account.objects.get(owner=self.user)

    def test_account_creation(self):
        self.assertEqual(self.account.owner, self.user)

    def test_account_string_representation(self):
        self.assertEqual(str(self.account), f"{self.user}'s account")

# ------- END OF MODEL TESTS ------- #


# ---------- VIEW TESTS ----------- #

class AccountViewTest(APITestCase):

    def setUp(self):
        # Create a user and set up a client
        self.user = User.objects.create_user(
            username='testuser', password='hejhej'
        )
        self.client.login(username='testuser', password='hejhej')

        # Create URL for account detail
        self.url = reverse(
            'account_detail', kwargs={'pk': self.user.account.pk}
        )

    def test_get_account_detail(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_account_detail(self):
        data = {'name': 'Updated Name', 'content': 'Updated Content'}
        response = self.client.put(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_account(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

# ------- END OF VIEW TESTS ------- #


# ------- SERIALIZER TESTS ------- #

class AccountSerializerTest(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='user1', password='hejhej'
        )
        self.account1 = Account.objects.get(owner=self.user1)

        self.client = APIClient()
        self.client.force_authenticate(user=self.user1)

    def test_serializer_data(self):
        # Make a request for context
        request = self.client.get('/').wsgi_request
        serializer = AccountSerializer(
            instance=self.account1, context={'request': request}
        )
        data = serializer.data

        # Check all fields
        self.assertEqual(
            set(data.keys()),
            {
                'owner', 'id', 'created_at', 'updated_at',
                'name', 'content', 'image', 'is_owner'
            }
        )
        self.assertEqual(data['owner'], self.user1.username)

# ------- END OF SERIALIZER TESTS ------- #
