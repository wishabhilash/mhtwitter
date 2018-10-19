from src.views.base import BaseView
from src import app
from src.views import StaticMixin
from flask import Response
        

class Index(StaticMixin, BaseView):
    def get(self):
        content = self._get_file("templates/index.html")
        return Response(content, mimetype="text/html")

class Static(StaticMixin, BaseView):
    mimes = {
        'js': 'text/javascript',
        'css': 'text/css'
    }
    def get(self, path):
        content = self._get_file(path)
        return Response(content, mimetype=self.mimes[path.split('.')[-1]])

class Home(StaticMixin, BaseView):
    def get(self):
        content = self._get_file("templates/home.html")
        return Response(content, mimetype="text/html")
