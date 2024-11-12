from flask import Flask
from backend.googleSheet import GoogleSheetV1
from postgreDB import PostgreDB

api = Flask(__name__)

@api.route('/data')
def data():
    # db = PostgreDB('leetcodeRecord1', 'postgres', '1')
    # response_body = db.fetch_data_as_dict()
    # db.close()
    gs = GoogleSheetV1()
    response_body = gs.getLeetcodeData()
    return response_body