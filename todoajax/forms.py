from django import forms

from .models import Task

class TaskFrom(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title']
        labels = {
            'title': (''),
        }
        widgets = {
            'title': forms.TextInput(attrs={'class':'form-control'})
        }