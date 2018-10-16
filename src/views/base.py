from flask.views import MethodView
from flask import jsonify
from datetime import datetime
from src import app

class BaseView(MethodView):
    
    def _404(self, message):
        return jsonify({
            'status': 'error',
            'message': message,
            'timestamp': datetime.utcnow().strftime(app.config['DATETIME_FORMAT'])
        }), 404

    def _success(self, data=None):
        return jsonify({
            'status': 'success',
            'data': data,
            'timestamp': datetime.utcnow().strftime(app.config['DATETIME_FORMAT'])
        }), 200