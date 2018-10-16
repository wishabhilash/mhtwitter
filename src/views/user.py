from src.views.base import BaseView
from src import models
from flask import request
from flask_jwt_extended import jwt_required

class User(BaseView):

    @jwt_required
    def get(self, email):
        user = models.User().get_by_email(email)
        if user is None:
            return self._404("User doesn't exist.")

        return self._success({
            'name': user.name,
            'email': user.email
        })

    