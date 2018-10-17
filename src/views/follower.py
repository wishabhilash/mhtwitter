from src.views.base import BaseView
from src import models
from flask import request
from flask_jwt_extended import jwt_required

class Follower(BaseView):

    @jwt_required
    def get(self, oid):
        return self._get_followers_of_user(oid)

    def _get_followers_of_user(self, oid):
        user = models.User().get_by_oid(oid)
        if user is None:
            return self._404("User doesn't exist.")

        followers = models.Follower().get_by_user(user)
        print(followers[0].follower.tweets)
        tweets = []
        for follower in followers:
            for tweet in follower.follower.tweets:
                tweets.append({
                    'created_at': tweet.created_at,
                    'tweet': tweet.tweet,
                    'oid': tweet.oid
                })
        return self._success({
            'tweets': list(reversed(sorted(tweets, key=lambda x: x['created_at'])))
        })

    @jwt_required
    def post(self):
        args = request.form
        if not ('leader_oid' in args and 'follower_oid' in args):
            return self._404("Invalid data.")
        
        self._create_follower(args)
        return self._success()

    def _create_follower(self, args):
        follower = models.Follower().create_follower(args['leader_oid'], args['follower_oid'])
        print(follower)

