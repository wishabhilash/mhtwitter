from src.views.base import BaseView
from src import models
from flask import request
from flask_jwt_extended import jwt_required

class User(BaseView):

    @jwt_required
    def get(self, oid=None):
        if oid is None:
            return self._get_users()
        else:
            return self._get_user(oid)

    def _get_user(self, oid):
        user = models.User().get_by_oid(oid)
        if user is None:
            return self._404("User doesn't exist.")

        return self._success({
            'oid': user.oid,
            'name': user.name,
            'email': user.email
        })

    def _get_users(self):
        users = models.User().query.all()[:100]
        if not users:
            return self._404("No users found.")

        result = []
        for user in users:
            result.append({
                'oid': user.oid,
                'name': user.name,
                'email': user.email
            })
        return self._success(result)

