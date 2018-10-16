from src import db
from src.db.base import BaseModel
from sqlalchemy.orm import validates, relationship
from sqlalchemy.ext.hybrid import hybrid_property
from werkzeug.security import generate_password_hash, check_password_hash

class User(BaseModel, db.Model):
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(200), unique=True)
    _password_hash = db.Column(db.String(300), nullable=False)
    tweets = relationship('Tweet', back_populates='user')

    @validates('email')
    def validate_email(self, key, email):
        assert '@' in email
        return email

    def validate_user(self, key, password):
        return check_password_hash(self._password_hash, password)

    @hybrid_property
    def password(self):
        return

    @password.setter
    def password(self, _password):
        self._password_hash = generate_password_hash(_password)

