from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


# Task Model
class Task(models.Model):
    # Each task is owned by a user.
    # When a user is deleted, their tasks are also deleted.
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name='task_owner'
    )
    # Allow a task to be permitted to multiple users
    permit_users = models.ManyToManyField(User, related_name='permitted_tasks')
    # Automaticaly set the time when the task is created and updated
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Define the title and content of task with character limits
    title = models.CharField(max_length=255)
    content = models.TextField(max_length=3000)
    # Set a due date for task.
    due_date = models.DateField()
    # Optional image field for task.
    image = models.ImageField(
        upload_to='task_images/', blank=True
    )
    # Fields to track if a task is overdue and if its public
    is_overdue = models.BooleanField(default=False)
    is_public = models.BooleanField(default=False)

    # Choices for task status
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
    ]
    # Field to set the task status, with 'open' as default
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='open'
    )

    # Choose task category
    CATEGORY_CHOICES = [
        ('work', 'Work'),
        ('personal', 'Personal'),
        ('other', 'Other'),
    ]
    # Set default category to 'other'
    category = models.CharField(
        max_length=20, choices=CATEGORY_CHOICES, default='other'
    )

    # Choose task priority
    PRIORITY_CHOICES = [
        ('urgent', '🔴 Urgent'),
        ('high', '🟡 High Priority'),
        ('medium', '🟢 Medium Priority'),
        ('low', '🔵 Low Priority'),
    ]
    # Set task priority, with 'medium' as default
    priority = models.CharField(
        max_length=20, choices=PRIORITY_CHOICES, default='medium'
    )

    class Meta:
        # Default ordering for tasks, with most recent first
        ordering = ['-created_at']

    def __str__(self):
        # String representation of task, showing its ID and title
        return f'{self.id} {self.title}'

    def save(self, *args, **kwargs):
        # Before saving, check if the task is overdue
        # and set 'is_overdue' if it is
        self.is_overdue = timezone.now().date() > self.due_date
        super(Task, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Before deleting, clear all relations in 'permit_users'
        self.permit_users.clear()
        super(Task, self).delete(*args, **kwargs)


# Comment Model
class Comment(models.Model):
    # Each comment is linked to a specific task
    task = models.ForeignKey(
        Task, related_name='comments', on_delete=models.CASCADE
    )
    # Link each comment to a user (author)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    # Define the content of the comment
    content = models.TextField()
    # Automaticaly set the time when the comment is created
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # String representing comment, showing the author and related task
        return f'Comment by {self.author} on {self.task}'
