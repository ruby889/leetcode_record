from flask import Flask, request, jsonify
from flask_cors import CORS
# from googleSheet import get_discarded_data
from googleSheetV2 import LeetcodeSheet
# from postgreDB import PostgreDB

api = Flask(__name__)
CORS(api, origins="http://localhost:3000", supports_credentials=True, methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
db =LeetcodeSheet()

@api.route('/data')
def data():
    # db = PostgreDB('leetcodeRecord1', 'postgres', '1')
    # response_body = db.fetch_data_as_dict()
    # db.close()
    response_body = db.get_data()
    return response_body

@api.route("/add", methods=["POST"], strict_slashes=False)
def add_entity():
    entity = request.get_json()
    db.update_row(entity)
    response_data = {'message': 'Data received successfully', 'received_data': entity}
    return jsonify(response_data), 200  # Return a JSON response with a status code