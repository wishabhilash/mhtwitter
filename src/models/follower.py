from src import db, app
from src.models.base import BaseModel
from sqlalchemy.orm import validates, relationship
from sqlalchemy.ext.hybrid import hybrid_property

class Follower(BaseModel, db.Model):
    leader_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    follower_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    leader = relationship('User', foreign_keys=[leader_id])
    follower = relationship('User', foreign_keys=[follower_id])

    
