from src import app
from src.views import (
    user, auth, tweet, follower, ui
)

# API URI's
# AUTH
app.add_url_rule('/auth/signup.json', view_func=auth.Signup.as_view('signup'), methods=['POST',])
app.add_url_rule('/auth/signin.json', view_func=auth.Auth.as_view('signin'), methods=['POST',])
app.add_url_rule('/auth/validate-token.json', view_func=auth.ValidateAccessToken.as_view('validate'), methods=['POST',])

# User
app.add_url_rule('/user.json', view_func=user.User.as_view('get_users'), methods=['GET',])
app.add_url_rule('/user/<string:oid>.json', view_func=user.User.as_view('get_user'), methods=['GET',])

app.add_url_rule(
    '/tweet/<string:oid>.json', view_func=tweet.Tweet.as_view('read_tweets'), methods=['GET'])
app.add_url_rule(
    '/tweet.json', view_func=tweet.Tweet.as_view('post_tweet'), methods=['POST'])

app.add_url_rule(
    '/follower/<string:oid>.json',
    view_func=follower.Follower.as_view('get_followers'), methods=['GET'])

app.add_url_rule(
    '/follower/<string:oid>/tweets.json',
    view_func=follower.FollowerTweets.as_view('get_followers_tweet'), methods=['GET'])


app.add_url_rule(
    '/follower.json',
    view_func=follower.Follower.as_view('create_followers'), methods=['POST'])


# TEMPLATE AND ASSET URI's
app.add_url_rule('/', view_func=ui.Index.as_view('index'), methods=['GET'])
app.add_url_rule('/asset/<path:path>', view_func=ui.Static.as_view('asset'), methods=['GET'])

app.add_url_rule('/home', view_func=ui.Home.as_view('home'), methods=['GET'])
app.add_url_rule('/user/<string:oid>', view_func=ui.Profile.as_view('user_profile'), methods=['GET'])