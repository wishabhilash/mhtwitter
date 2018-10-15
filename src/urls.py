from src import app
from src.views import auth


app.add_url_rule('/auth', view_func=auth.Auth.as_view('auth'), methods=['GET',])