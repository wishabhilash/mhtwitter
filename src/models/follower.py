from src import db, app
from src.models.base import BaseModel
from sqlalchemy.orm import validates, relationship
from sqlalchemy.ext.hybrid import hybrid_property
from src import models

class Follower(BaseModel, db.Model):
    leader_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    follower_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    leader = relationship('User', foreign_keys=[leader_id])
    follower = relationship('User', foreign_keys=[follower_id])

    def get_by_user(self, user):
        followers = self.query.filter(Follower.leader_id == user.id).all()
        return followers
    
    def create_follower(self, leader_oid, follower_oid):
        leader = models.User().get_by_oid(leader_oid)
        follower = models.User().get_by_oid(follower_oid)
        self.leader_id = leader.id
        self.follower_id = follower.id
        self.save()
        return self
