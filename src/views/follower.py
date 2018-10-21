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
        result = []
        for follower in followers:
            result.append({
                'name': follower.follower.name,
                'email': follower.follower.email,
                'oid': follower.follower.oid
            })
        return self._success(result)

    @jwt_required
    def post(self):
        args = request.form
        if not ('leader_oid' in args and 'follower_oid' in args):
            return self._404("Invalid data.")        
        return self._create_follower(args)

    def _create_follower(self, args):
        if args['leader_oid'] == args['follower_oid']:
            return self._404("User can't follow ownself.")
            
        leader_user = models.User().get_by_oid(args['leader_oid'])
        follower_user = models.User().get_by_oid(args['follower_oid'])
        
        followerObj = models.Follower()
        followerExists = followerObj.query.filter(
            models.Follower.leader==leader_user,
            models.Follower.follower==follower_user
        ).all()
        if not followerExists:
            follower = models.Follower().create_follower(args['leader_oid'], args['follower_oid'])
            return self._success()
        else:
            return self._404("User is already a follower")


class FollowerTweets(BaseView):

    @jwt_required
    def get(self, oid):
        return self._get_tweets_of_followers(oid)

    def _get_tweets_of_followers(self, oid):
        user = models.User().get_by_oid(oid)
        if user is None:
            return self._404("User doesn't exist.")

        followers = models.Follower().get_by_user(user)
        tweets = []
        for follower in followers:
            for tweet in follower.follower.tweets:
                tweets.append({
                    'created_at': tweet.created_at,
                    'tweet': tweet.tweet,
                    'oid': tweet.oid,
                    'follower': {
                        'name': follower.follower.name,
                        'email': follower.follower.email,
                        'oid': follower.follower.oid
                    }
                })
        return self._success(list(reversed(sorted(tweets, key=lambda x: x['created_at']))))