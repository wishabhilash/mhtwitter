from src import db
from src.db.base import BaseModel
from sqlalchemy.orm import validates

class User(BaseModel, db.Model):
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(200), unique=True)
    password = db.Column(db.String(300), nullable=False)

    @validates('email')
    def validate_email(self, key, email):
        assert '@' in email
        return email
