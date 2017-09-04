from django.conf.urls import url

from .views import (
    ListTasksApiView,
    AddTaskApiView,
    DeleteTaskApiView,
    DeleteAllTasksApiView,
    UpdateTaskApiView
)


urlpatterns = [
    url(r'^list/$', ListTasksApiView.as_view(), name='list_tasks'),
    url(r'^add/$', AddTaskApiView.as_view(), name='add_task'),
    url(r'^delete/$', DeleteTaskApiView.as_view(), name='delete_task'),
    url(r'^update/$', UpdateTaskApiView.as_view(), name='update_task_name'),
    url(r'^delete/all/$', DeleteAllTasksApiView.as_view(), name='delete_all_task'),
]
