from flask import Flask
from flask_cors import CORS
from routes.react import react_bp
from routes.api import api_bp
from routes.remote_device_wv import remotecdm_wv_bp
from routes.login import login_bp

app = Flask(__name__, static_folder='react/build/static', template_folder='react/build')

CORS(app, supports_credentials=True)

# Register the blueprint
app.register_blueprint(react_bp)
app.register_blueprint(api_bp)

app.register_blueprint(remotecdm_wv_bp)

app.register_blueprint(login_bp)

if __name__ == '__main__':
    app.run(debug=True)