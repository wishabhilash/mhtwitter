from src.views.base import BaseView
from src.models import User
from flask import request
from src import db
import sqlite3

class Signin(BaseView):
    def post(self):
        print(request)
        return ""


class Signup(BaseView):
    def post(self):
        return self._create_user(request.form)

    def _create_user(self, args):
        if not('name' in args and 'email' in args and 'password' in args):
            return self._404('Invalid data')

        user = User(name=args['name'], email=args['email'], password=args['password'])

        try:
            user.save()
        except Exception as e:
            return self._404('Email already exists')
        
        return self._success({
            'name': user.name,
            'email': user.email
        })
