import os
from flask import Blueprint, jsonify, request, current_app, Response
import base64
from typing import Any, Optional, Union
from google.protobuf.message import DecodeError
from pywidevine.pssh import PSSH as widevinePSSH
from pywidevine import __version__
from pywidevine.cdm import Cdm as widevineCDM
from pywidevine.device import Device as widevineDevice
from pywidevine.exceptions import (InvalidContext, InvalidInitData, InvalidLicenseMessage, InvalidLicenseType,
                                   InvalidSession, SignatureMismatch, TooManySessions)
from custom_functions.database.cache_to_db import cache_to_db

remotecdm_wv_bp = Blueprint('remotecdm_wv', __name__)

@remotecdm_wv_bp.route('/remotecdm/widevine', methods=['GET', 'HEAD'])
def remote_cdm_widevine():
    if request.method == 'GET':
        return jsonify({
            'status': 200,
            'message': "CDRM-Project's Remote Widevine CDM."
        })
    if request.method == 'HEAD':
        response = Response(status=200)
        response.headers['Server'] = f'https://github.com/devine-dl/pywidevine serve v{__version__}'
        return response

@remotecdm_wv_bp.route('/remotecdm/widevine/deviceinfo', methods=['GET'])
def remote_cdm_widevine_deviceinfo():
    if request.method == 'GET':
        device = widevineDevice.load(f'{os.getcwd()}/configs/CDMs/WV/CDRM.wvd')
        cdm = widevineCDM.from_device(device)
        return jsonify({
            'device_type': 'ANDROID',
            'system_id': cdm.system_id,
            'security_level': cdm.security_level,
            'host': 'https://cdrm-project.com/remotecdm/widevine',
            'secret': 'CDRM',
            'device_name': 'CDRM'
        })

@remotecdm_wv_bp.route('/remotecdm/widevine/<device>/open', methods=['GET'])
def remote_cdm_widevine_open(device):
    if str(device) == 'CDRM':
        wv_device = widevineDevice.load(f'{os.getcwd()}/configs/CDMs/WV/CDRM.wvd')
        cdm = current_app.config["CDM"] = widevineCDM.from_device(wv_device)
        session_id = cdm.open()
        return jsonify({
            'status': 200,
            'message': 'Success',
            'data': {
                'session_id': session_id.hex(),
                'device': {
                    'system_id': cdm.system_id,
                    'security_level': cdm.security_level,
                }
            }
        })
    else:
        return jsonify({
            'status': 400,
            'message': 'Unauthorized'
        })

@remotecdm_wv_bp.route('/remotecdm/widevine/<device>/close/<session_id>', methods=['GET'])
def remote_cdm_widevine_close(device, session_id):
    if str(device) == 'CDRM':
        session_id = bytes.fromhex(session_id)
        cdm = current_app.config["CDM"]
        if not cdm:
            return jsonify({
                'status': 400,
                'message': f'No CDM for "{device}" has been opened yet. No session to close'
            })
        try:
            cdm.close(session_id)
        except InvalidSession:
            return jsonify({
                'status': 400,
                'message': f'Invalid session ID "{session_id.hex()}", it may have expired'
            })
        return jsonify({
            'status': 200,
            'message': f'Successfully closed Session "{session_id.hex()}".',
        })
    else:
        return jsonify({
            'status': 400,
            'message': f'Unauthorized'
        })

@remotecdm_wv_bp.route('/remotecdm/widevine/<device>/set_service_certificate', methods=['POST'])
def remote_cdm_widevine_set_service_certificate(device):
    if str(device) == 'CDRM':
        body = request.get_json()
        for required_field in ("session_id", "certificate"):
            if required_field == "certificate":
                has_field = required_field in body  # it needs the key, but can be empty/null
            else:
                has_field = body.get(required_field)
            if not has_field:
                return jsonify({
                    'status': 400,
                    'message': f'Missing required field "{required_field}" in JSON body'
                })

        session_id = bytes.fromhex(body["session_id"])

        cdm = current_app.config["CDM"]
        if not cdm:
            return jsonify({
                'status': 400,
                'message': f'No CDM session for "{device}" has been opened yet. No session to use'
            })

        certificate = body["certificate"]
        try:
            provider_id = cdm.set_service_certificate(session_id, certificate)
        except InvalidSession:
            return jsonify({
                'status': 400,
                'message': f'Invalid session id: "{session_id.hex()}", it may have expired'
            })
        except DecodeError as error:
            return jsonify({
                'status': 400,
                'message': f'Invalid Service Certificate, {error}'
            })
        except SignatureMismatch:
            return jsonify({
                'status': 400,
                'message': 'Signature Validation failed on the Service Certificate, rejecting'
            })
        return jsonify({
            'status': 200,
            'message': f"Successfully {['set', 'unset'][not certificate]} the Service Certificate.",
            'data': {
                'provider_id': provider_id,
            }
        })
    else:
        return jsonify({
            'status': 400,
            'message': f'Unauthorized'
        })

@remotecdm_wv_bp.route('/remotecdm/widevine/<device>/get_service_certificate', methods=['POST'])
def remote_cdm_widevine_get_service_certificate(device):
    if str(device) == 'CDRM':
        body = request.get_json()
        for required_field in ("session_id",):
            if not body.get(required_field):
                return jsonify({
                    'status': 400,
                    'message': f'Missing required field "{required_field}" in JSON body'
                })

        session_id = bytes.fromhex(body["session_id"])

        cdm = current_app.config["CDM"]

        if not cdm:
            return jsonify({
                'status': 400,
                'message': f'No CDM session for "{device}" has been opened yet. No session to use'
            })

        try:
            service_certificate = cdm.get_service_certificate(session_id)
        except InvalidSession:
            return jsonify({
                'status': 400,
                'message': f'Invalid Session ID "{session_id.hex()}", it may have expired'
            })
        if service_certificate:
            service_certificate_b64 = base64.b64encode(service_certificate.SerializeToString()).decode()
        else:
            service_certificate_b64 = None
        return jsonify({
            'status': 200,
            'message': 'Successfully got the Service Certificate',
            'data': {
                'service_certificate': service_certificate_b64,
            }
        })
    else:
        return jsonify({
            'status': 400,
            'message': f'Unauthorized'
        })

@remotecdm_wv_bp.route('/remotecdm/widevine/<device>/get_license_challenge/<license_type>', methods=['POST'])
def remote_cdm_widevine_get_license_challenge(device, license_type):
    if str(device) == 'CDRM':
        body = request.get_json()
        for required_field in ("session_id", "init_data"):
            if not body.get(required_field):
                return jsonify({
                    'status': 400,
                    'message': f'Missing required field "{required_field}" in JSON body'
                })
        session_id = bytes.fromhex(body["session_id"])
        privacy_mode = body.get("privacy_mode", True)
        cdm = current_app.config["CDM"]
        if not cdm:
            return jsonify({
                'status': 400,
                'message': f'No CDM session for "{device}" has been opened yet. No session to use'
            })
        if current_app.config.get("force_privacy_mode"):
            privacy_mode = True
            if not cdm.get_service_certificate(session_id):
                return jsonify({
                    'status': 403,
                    'message': 'No Service Certificate set but Privacy Mode is Enforced.'
                })

        current_app.config['pssh'] = body['init_data']
        init_data = widevinePSSH(body['init_data'])

        try:
            license_request = cdm.get_license_challenge(
                session_id=session_id,
                pssh=init_data,
                license_type=license_type,
                privacy_mode=privacy_mode
            )
        except InvalidSession:
            return jsonify({
                'status': 400,
                'message': f'Invalid Session ID "{session_id.hex()}", it may have expired'
            })
        except InvalidInitData as error:
            return jsonify({
                'status': 400,
                'message': f'Invalid Init Data, {error}'
            })
        except InvalidLicenseType:
            return jsonify({
                'status': 400,
                'message': f'Invalid License Type {license_type}'
            })
        return jsonify({
            'status': 200,
            'message': 'Success',
            'data': {
                'challenge_b64': base64.b64encode(license_request).decode()
            }
        })
    else:
        return jsonify({
            'status': 400,
            'message': f'Unauthorized'
        })


@remotecdm_wv_bp.route('/remotecdm/widevine/<device>/parse_license', methods=['POST'])
def remote_cdm_widevine_parse_license(device):
    if str(device) == 'CDRM':
        body = request.get_json()
        for required_field in ("session_id", "license_message"):
            if not body.get(required_field):
                return jsonify({
                    'status': 400,
                    'message': f'Missing required field "{required_field}" in JSON body'
                })
        session_id = bytes.fromhex(body["session_id"])
        cdm = current_app.config["CDM"]
        if not cdm:
            return jsonify({
                'status': 400,
                'message': f'No CDM session for "{device}" has been opened yet. No session to use'
            })
        try:
            cdm.parse_license(session_id, body['license_message'])
        except InvalidLicenseMessage as error:
            return jsonify({
                'status': 400,
                'message': f'Invalid License Message, {error}'
            })
        except InvalidContext as error:
            return jsonify({
                'status': 400,
                'message': f'Invalid Context, {error}'
            })
        except InvalidSession:
            return jsonify({
                'status': 400,
                'message': f'Invalid Session ID "{session_id.hex()}", it may have expired'
            })
        except SignatureMismatch:
            return jsonify({
                'status': 400,
                'message': f'Signature Validation failed on the License Message, rejecting.'
            })
        return jsonify({
            'status': 200,
            'message': 'Successfully parsed and loaded the Keys from the License message.',
        })
    else:
        return jsonify({
            'status': 400,
            'message': 'Unauthorized'
        })

@remotecdm_wv_bp.route('/remotecdm/widevine/<device>/get_keys/<key_type>', methods=['POST'])
def remote_cdm_widevine_get_keys(device, key_type):
    if str(device) == 'CDRM':
        body = request.get_json()
        for required_field in ("session_id",):
            if not body.get(required_field):
                return jsonify({
                    'status': 400,
                    'message': f'Missing required field "{required_field}" in JSON body'
                })
        session_id = bytes.fromhex(body["session_id"])
        key_type: Optional[str] = key_type
        if key_type == 'ALL':
            key_type = None
        cdm = current_app.config["CDM"]
        if not cdm:
            return jsonify({
                'status': 400,
                'message': f'No CDM session for "{device}" has been opened yet. No session to use'
            })
        try:
            keys = cdm.get_keys(session_id, key_type)
        except InvalidSession:
            return jsonify({
                'status': 400,
                'message': f'Invalid Session ID "{session_id.hex()}", it may have expired'
            })
        except ValueError as error:
            return jsonify({
                'status': 400,
                'message': f'The Key Type value "{key_type}" is invalid, {error}'
            })
        keys_json = [
            {
                "key_id": key.kid.hex,
                "key": key.key.hex(),
                "type": key.type,
                "permissions": key.permissions
            }
            for key in keys
            if not key_type or key.type == key_type
        ]
        for entry in keys_json:
            if entry['type'] != 'SIGNING':
                cache_to_db(pssh=str(current_app.config['pssh']), kid=entry['key_id'], key=entry['key'])


        return jsonify({
            'status': 200,
            'message': 'Success',
            'data': {
                'keys': keys_json
            }
        })