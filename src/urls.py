from src import app
from src.views import user, auth, tweet

# AUTH
app.add_url_rule('/auth/signup', view_func=auth.Signup.as_view('signup'), methods=['POST',])
app.add_url_rule('/auth/signin', view_func=auth.Auth.as_view('signin'), methods=['POST',])

# User
app.add_url_rule('/user/<string:email>', view_func=user.User.as_view('user'), methods=['GET',])

app.add_url_rule(
    '/tweet/<string:email>', view_func=tweet.Tweet.as_view('read_tweets'), methods=['GET'])
app.add_url_rule(
    '/tweet', view_func=tweet.Tweet.as_view('post_tweet'), methods=['POST'])
