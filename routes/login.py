from flask import Blueprint, request, current_app, make_response, jsonify

login_bp = Blueprint('login_bp', __name__)


@login_bp.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        request_body = request.get_json()
        print(request_body)
        response = make_response(jsonify({
            'message': 'Login Successful',
        }))
        response.set_cookie('is_logged_in', 'true')
        return response


@login_bp.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        request_body = request.get_json()