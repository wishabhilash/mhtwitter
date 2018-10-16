from src import app
from src import views

# AUTH
app.add_url_rule('/auth/signup', view_func=views.Signup.as_view('signup'), methods=['POST',])
app.add_url_rule('/auth/signin', view_func=views.Auth.as_view('signin'), methods=['POST',])

# User
# app.add_url_rule('/user/<str:email>', view_func=views.User.as_view('signin'), methods=['POST',])