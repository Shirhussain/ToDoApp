from django.urls import path
from . views import AjaxIndex, TaskComplete, TaskDelete
urlpatterns = [
    path('', AjaxIndex.as_view(), name="index"),
    path('<str:id>/completed/', TaskComplete.as_view(), name="complete"),
    path('<str:id>/delete/', TaskDelete.as_view(), name="delete"),
]
