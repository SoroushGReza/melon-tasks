from django.contrib.auth.models import User
from .models import Task
from rest_framework import status
from rest_framework.test import APITestCase
from datetime import date


# ------------- TDD TESTS -------------

class TaskAPITests(APITestCase):
    def setUp(self):
        # Create a user for the test
        self.user = User.objects.create_user(
            username='testuser',
            password='hejhej'
        )
        self.task_url = '/tasks/'

    def test_can_list_tasks(self):
        # Log in before making the GET request
        self.client.login(username='testuser', password='hejhej')

        # Create a task
        Task.objects.create(
            owner=self.user,
            title='Test Task',
            due_date=date.today(),
            is_public=True  # Make sure task is public
        )

        # Make a GET request to list tasks
        response = self.client.get(self.task_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_logged_in_user_can_create_task(self):
        # Log in
        self.client.login(username='testuser', password='hejhej')

        # Make a POST request to create a task
        response = self.client.post(self.task_url, {
            'title': 'New Task',
            'due_date': date.today().isoformat(),
            'category': 'work',
            'priority': 'high',
            'is_public': True  # Specify the visibility of the task
        })

        # Assert that the response code is 201 Created,
        # indicating that the task was successfully created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check if the task was actually created
        # with correct category and priority
        task = Task.objects.get(title='New Task')
        self.assertEqual(task.category, 'work')
        self.assertEqual(task.priority, 'high')

        # Check if the task was actually created
        count = Task.objects.count()
        self.assertEqual(count, 1)

    def test_user_not_logged_in_cant_create_task(self):
        # Make a POST request without logging in
        response = self.client.post(
            self.task_url,
            {'title': 'Another Task',
             'due_date': date.today().isoformat(),
             'is_public': True}
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


# ------------- END OF TDD TESTS -------------
