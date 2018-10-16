from src import db
from src.models.base import BaseModel
from sqlalchemy.orm import validates, relationship
from sqlalchemy.ext.hybrid import hybrid_property
from werkzeug.security import generate_password_hash, check_password_hash

class User(BaseModel, db.Model):
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(200), unique=True)
    _password_hash = db.Column(db.Text, nullable=False)
    tweets = relationship('Tweet', back_populates='user')
    # followers = relationship('Follower', back_populates='follower')
    is_active = db.Column(db.Boolean, nullable=False, default=True)

    def __init__(self, name=None, email=None, password=None):
        if name is not None and email is not None and password is not None:
            self.name = name
            self.email = email
            self.password = password

    @validates('email')
    def validate_email(self, key, email):
        assert '@' in email
        return email

    def authenticate(self, password):
        return check_password_hash(self._password_hash, password)

    @hybrid_property
    def password(self):
        return

    @password.setter
    def password(self, _password):
        self._password_hash = generate_password_hash(_password)

    def get_by_email(self, email):
        users = User.query.filter(User.email == email)
        if users.count() == 1:
            return users[0]
        else:
            return None
