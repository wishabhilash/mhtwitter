from src.views.base import BaseView
from src import models
from flask import request
from flask_jwt_extended import jwt_required

class Tweet(BaseView):

    @jwt_required
    def get(self, oid):
        return self._get_tweets_of_user(oid)

    def _get_tweets_of_user(self, oid):
        user = models.User().get_by_oid(oid)
        tweets = []
        if user.tweets is not None:
            for t in user.tweets:
                tweets.append({
                    'created_at': t.created_at,
                    'tweet': t.tweet,
                    'oid': t.oid,
                    'name': user.name,
                    'email': user.email
                })
        return self._success({
            'tweets': list(reversed(tweets))
        })

    @jwt_required
    def post(self):
        args = request.form
        user = models.User().get_by_oid(args['oid'])
        if user is None:
            return self._404("User doesn't exist.")
        tweet = models.Tweet(user, args['content'])
        try:
            tweet.save()
        except Exception as e:
            return self._404('Encountered error while saving')
        return self._success()
        