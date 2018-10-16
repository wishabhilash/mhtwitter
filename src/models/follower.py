from src import db, app
from src.models.base import BaseModel
from sqlalchemy.orm import validates, relationship
from sqlalchemy.ext.hybrid import hybrid_property

class Follower(BaseModel, db.Model):
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
	follower_id = db.Column(db.Integer, db.ForeignKey('user.id'))

	user = relationship('User', back_populates='user', foreign_keys=[user_id])
	follower = relationship('User', back_populates='followers', foreign_keys=[follower_id])
	
