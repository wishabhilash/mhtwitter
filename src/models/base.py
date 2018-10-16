from src import db, app
from datetime import datetime
from sqlalchemy.ext.hybrid import hybrid_property
import uuid

class BaseModel(object):
    id = db.Column(db.Integer, primary_key=True)
    oid = db.Column(db.String, nullable=False, default=str(uuid.uuid1()), unique=True)
    _created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    _modified_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def save(self):
        db.session.add(self)
        db.session.commit()

    @hybrid_property
    def created_at(self):
        return self._created_at.strftime(app.config['DATETIME_FORMAT'])

    @created_at.setter
    def created_at(self, _created_at):
    	self._created_at = _created_at