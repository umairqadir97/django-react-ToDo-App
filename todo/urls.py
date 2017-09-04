from django.conf.urls import url, include
from django.contrib import admin

from .core.views import HomeView

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', HomeView.as_view(), name='home'),
    url(r'^task/', include('tasks.urls', namespace='TASKS')),
]
