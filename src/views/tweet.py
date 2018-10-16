from src.views.base import BaseView
from src import models
from flask import request
from flask_jwt_extended import jwt_required

class Tweet(BaseView):

    @jwt_required
    def get(self, email):
        return self._get_tweets_of_user(email)

    def _get_tweets_of_user(self, email):
        user = models.User().get_by_email(email)
        tweets = []
        for t in user.tweets:
            tweets.append({
                'created_at': t.created_at,
                'tweet': t.tweet
            })
        return self._success({
            'tweets': tweets
        })

    @jwt_required
    def post(self):
        args = request.form
        user = models.User().get_by_email(args['email'])
        if user is None:
            return self._404("User doesn't exist.")
        tweet = models.Tweet(user, args['content'])
        try:
            tweet.save()
        except Exception as e:
            return self._404('Encountered error while saving')
        return self._success()
        
    