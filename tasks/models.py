from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Task(models.Model):
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE,
        related_name='task_owner'
    )
    permit_users = models.ManyToManyField(User, related_name='permitted_tasks')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=255)
    content = models.TextField(max_length=3000)
    due_date = models.DateField()
    image = models.ImageField(
        upload_to='task_images/', blank=True
    )
    is_overdue = models.BooleanField(default=False)
    is_public = models.BooleanField(default=False)

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
    ]
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='open'
    )

    CATEGORY_CHOICES = [
        ('work', 'Work'),
        ('personal', 'Personal'),
        ('other', 'Other'),
    ]
    category = models.CharField(
        max_length=20, choices=CATEGORY_CHOICES, default='other'
    )

    PRIORITY_CHOICES = [
        ('urgent', '🔴 Urgent'),
        ('high', '🟡 High Priority'),
        ('medium', '🟢 Medium Priority'),
        ('low', '🔵 Low Priority'),
    ]
    priority = models.CharField(
        max_length=20, choices=PRIORITY_CHOICES, default='medium'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.id} {self.title}'

    def save(self, *args, **kwargs):
        # Set is_overdue based on if current date is after due_date
        self.is_overdue = timezone.now().date() > self.due_date
        super(Task, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Clear all relations in permit_users before deletion
        self.permit_users.clear()
        super(Task, self).delete(*args, **kwargs)


class Comment(models.Model):
    task = models.ForeignKey(
        Task, related_name='comments', on_delete=models.CASCADE
    )
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.author} on {self.task}'
