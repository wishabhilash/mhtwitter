from flask.views import MethodView
from flask import jsonify

class BaseView(MethodView):
    
    def _404(self, message):
        return jsonify({
            'status': 'error',
            'message': message
        }), 404

    def _success(self, data):
        return jsonify({
            'status': 'success',
            'data': data
        }), 200