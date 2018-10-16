from src import db, app
from src.models.base import BaseModel
from sqlalchemy.orm import validates, relationship
from sqlalchemy.ext.hybrid import hybrid_property

class Tweet(BaseModel, db.Model):
    _tweet = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = relationship('User', back_populates='tweets', foreign_keys=[user_id])

    @hybrid_property
    def tweet(self):
        return self._tweet

    @validates
    def validate_tweet(self, _tweet):
        assert len(_tweet) <= app.config['TWEET_CHARACTER_LIMIT']
        return _tweet

    @tweet.setter
    def tweet(self, _tweet):
        self._tweet = _tweet