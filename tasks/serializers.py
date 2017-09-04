from rest_framework import serializers

from .models import TaskModel

FORMAT = {
    'format': '%d/%m/%Y %H:%M:%S',
    'input_formats': ['%d/%m/%Y %H:%M:%S']
}


class TaskSerializer(serializers.Serializer):
    task_name = serializers.CharField(source='task', max_length=255)
    task_id = serializers.IntegerField(source='id', read_only=True, required=False)
    task_created_time = serializers.DateTimeField(source='created', read_only=True, required=False, **FORMAT)

    def create(self, validated_data):
        task_name = validated_data.pop('task')
        task = TaskModel(task=task_name)
        task.save()
        return task

    def update(self, instance, validated_data):
        instance.task = validated_data.get('task', instance.task)
        instance.save()
        return instance
