import os
from src import app

class StaticMixin(object):
    
    def _get_file(self, filepath):
        content = ""
        try:
            content = open(os.path.join(app.config['STATIC_PATH'], filepath)).read()
        except Exception as e:
            print(e)
            pass
        return content
        
        
        