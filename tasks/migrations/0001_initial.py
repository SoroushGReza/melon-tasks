from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(max_length=255)),
                ('content', models.TextField(max_length=3000)),
                ('due_date', models.DateField()),
                ('image', models.ImageField(blank=True, upload_to='task_images/')),
                ('is_overdue', models.BooleanField(default=False)),
                ('is_public', models.BooleanField(default=False)),
                ('status', models.CharField(choices=[('open', 'Open'), ('in_progress', 'In Progress'), ('done', 'Done')], default='open', max_length=20)),
                ('category', models.CharField(choices=[('work', 'Work'), ('personal', 'Personal'), ('other', 'Other')], default='other', max_length=20)),
                ('priority', models.CharField(choices=[('urgent', '🔴 Urgent'), ('high', '🟡 High Priority'), ('medium', '🟢 Medium Priority'), ('low', '🔵 Low Priority')], default='medium', max_length=20)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='task_owner', to=settings.AUTH_USER_MODEL)),
                ('permit_users', models.ManyToManyField(related_name='permitted_tasks', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='tasks.task')),
            ],
        ),
    ]
