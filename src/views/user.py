from src.views.base import BaseView
from src import models
from flask import request
from flask_jwt_extended import jwt_required

class User(BaseView):

    @jwt_required
    def get(self, oid):
        user = models.User().get_by_oid(oid)
        if user is None:
            return self._404("User doesn't exist.")

        return self._success({
            'oid': user.oid,
            'name': user.name,
            'email': user.email
        })

