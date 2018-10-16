from src.views.base import BaseView
from src.models import User
from flask import request
from src import db, jwt, app
import sqlite3
from flask_jwt_extended import create_access_token, create_refresh_token
from datetime import timedelta


class Auth(BaseView):
    def post(self):
        args = request.form
        if not('email' in args and 'password' in args):
            print(args)
            return self._404('Invalid data')
        return self._authenticate_user(args['email'], args['password'])

    def _authenticate_user(self, email, password):
        user = User().get(email)
        if user is None:
            return self._404('User does\'t exist.')

        if user.validate_user(password):
            access_token = create_access_token(
                user.email, 
                expires_delta=timedelta(days=app.config['ACCESS_TOKEN_EXPIRY'])
            )
            refresh_token = create_refresh_token(
                user.email,
                expires_delta=timedelta(days=app.config['REFRESH_TOKEN_EXPIRY'])
            )
            return self._success({
                'access_token': access_token,
                'refresh_token': refresh_token
            })
        else:
            return self._404('Invalid credentials.')


class Signup(BaseView):
    def post(self):
        args = request.form
        if not('name' in args and 'email' in args and 'password' in args):
            return self._404('Invalid data')

        return self._create_user(args)

    def _create_user(self, args):
        user = User(name=args['name'], email=args['email'], password=args['password'])
        try:
            user.save()
        except Exception as e:
            return self._404('Email already exists')
        
        return self._success({
            'name': user.name,
            'email': user.email
        })
