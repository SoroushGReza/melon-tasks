from django.contrib.auth.models import User
from .models import Task
from rest_framework import status
from rest_framework.test import APITestCase
from datetime import date


class TaskAPITests(APITestCase):
    def setUp(self):
        # Sets up testing environment before each test
        # Here we create a test user and a URL for task related requests
        self.user = User.objects.create_user(
            username='testuser',
            password='hejhej'
        )
        self.task_url = '/tasks/'

    def test_can_list_tasks(self):
        # This test checks if tasks can be listed by a logged in user
        self.client.login(username='testuser', password='hejhej')  # User login

        # Create a test task assigned to 'testuser'
        Task.objects.create(
            owner=self.user,
            title='Test Task',
            due_date=date.today(),
            is_public=True
        )

        # Perform GET request to list tasks and check response
        response = self.client.get(self.task_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_logged_in_user_can_create_task(self):
        # Verifies if a logged in user can create a task
        self.client.login(username='testuser', password='hejhej')  # User login

        # Perform POST request to create new task
        response = self.client.post(self.task_url, {
            'title': 'New Task',
            'due_date': date.today().isoformat(),
            'category': 'work',
            'priority': 'high',
            'is_public': True
        })

        # Check if task creation was successful
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verify the created task properties
        task = Task.objects.get(title='New Task')
        self.assertEqual(task.category, 'work')  # Check task category
        self.assertEqual(task.priority, 'high')  # Check task priority

        # Confirm task was added to the database
        count = Task.objects.count()
        self.assertEqual(count, 1)  # Verify one task is present in database

    def test_user_not_logged_in_cant_create_task(self):
        # Ensure that logged out users cannot create a task

        # Attempt to create task without logging in
        response = self.client.post(
            self.task_url,
            {'title': 'Another Task',
             'due_date': date.today().isoformat(),
             'is_public': True}
        )

        # Check if server forbids task creation
        # due to lack of authentication
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
