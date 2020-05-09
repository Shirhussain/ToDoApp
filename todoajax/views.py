from django.shortcuts import render, redirect
from django.views.generic import View
from django.http import JsonResponse
from django.forms.models import model_to_dict

from .models import Task
from .forms import TaskFrom


class AjaxIndex(View):
    def get(self, request):
        form = TaskFrom()
        tasks = Task.objects.all()

        context = {
            "form": form,
            "tasks": tasks,
        }
        return render(request, "index.html", context)

    def post(self, request):
        form = TaskFrom(request.POST)

        if form.is_valid():
            new_task = form.save()
            # return redirect("index") # we i didn't have the jsone response i use this line
            return JsonResponse({'task': model_to_dict(new_task)}, status=200)

        else:
            return redirect("index")


class TaskComplete(View):
    def post(self, request, id):
        task = Task.objects.get(id=id)
        task.completed = True
        task.save()
        return JsonResponse({'task': model_to_dict(task)}, status=200)


class TaskDelete(View):
    def post(self, request, id):
        task = Task.objects.get(id=id)
        task.delete()
        return JsonResponse({'result': 'ok'}, status=200)
