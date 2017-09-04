from django.db import models


class TaskModel(models.Model):
    task = models.CharField(max_length=255, blank=False, null=False)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.task

    class Meta:
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'
