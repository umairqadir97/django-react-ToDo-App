from rest_framework.views import APIView
from rest_framework.response import Response

from .models import TaskModel
from .serializers import TaskSerializer


class TaskException(Exception):
    pass


class TaskApiMixin(object):
    model = None
    serializer = None

    @staticmethod
    def _get_obj(obj, err):
        if obj is None:
            raise (err if isinstance(err, TaskException) else Exception('unknow error'))
        return obj

    @property
    def get_model(self):
        return self._get_obj(self.model, TaskException('model cannot be None'))

    @property
    def get_serializer(self):
        return self._get_obj(self.serializer, TaskException('serializer cannot be None'))


class ListTasksApiView(TaskApiMixin, APIView):
    model = TaskModel
    serializer = TaskSerializer

    def get(self, request, format=None):
        model = self.get_model
        tmpTasks = model.objects.all().order_by('-id')
        serializer = self.get_serializer(tmpTasks, many=True)
        return Response({'tasks': serializer.data, 'message': '', 'code': 200})


class AddTaskApiView(TaskApiMixin, APIView):
    serializer = TaskSerializer

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'code': 201, 'message': '', 'task': serializer.data})
        return Response({'code': 400, 'message': 'Cannot add task.', 'task': ''})


class DeleteTaskApiView(TaskApiMixin, APIView):
    model = TaskModel
    serializer = TaskSerializer

    def get(self, request, format=None):
        model = self.get_model
        task_id = request.query_params.get('task_id', None)
        task = None

        try:
            task = model.objects.get(id=task_id)
        except model.DoesNotExist:
            pass

        if task is None:
            return Response({
                'code': 404,
                'message': 'task does not exists',
                'task': ''
            })

        taskResponse = self.get_serializer(task).data
        task.delete()
        return Response({'code': 200, 'message': '', 'task': taskResponse})


class UpdateTaskApiView(TaskApiMixin, APIView):
    model = TaskModel
    serializer = TaskSerializer

    def put(self, request, format=None):
        task = None

        try:
            task = self.get_model.objects.get(id=request.data.get('task_id', -1))
        except self.get_model.DoesNotExist:
            pass

        if task is None:
            return Response({'code': 404, 'message': 'task not found'})

        serializer = self.get_serializer(task, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({'code': 202, 'message': ''})
        return Response({'code': 404, 'message': 'cannot update task.'})


class DeleteAllTasksApiView(TaskApiMixin, APIView):
    model = TaskModel

    def get(self, request, format=None):
        model = self.get_model
        all_tasks = model.objects.all()
        for task in all_tasks:
            task.delete()
        return Response({'code': 200, 'message': '', 'tasks': []})
