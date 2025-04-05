from flask import Blueprint, send_from_directory
import os

react_bp = Blueprint('react_bp', __name__, static_folder='react/build/static', template_folder='react/build')

@react_bp.route('/')
@react_bp.route('/<path:path>')
def index(path=None):
    # If the path is not provided (i.e., the homepage), serve the index.html
    if path is None or not os.path.exists(os.path.join(os.getcwd(), 'react/build', path)):
        return send_from_directory(os.path.join(os.getcwd(), 'react/build'), 'index.html')
    # Otherwise, serve the static file (for example, if you need to access assets in the /static folder)
    return send_from_directory(os.path.join(os.getcwd(), 'react/build'), path)
