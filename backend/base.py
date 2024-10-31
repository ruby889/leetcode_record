from flask import Flask
from readGoogleSheet import getLeetcodeData
from postgreDB import PostgreDB

api = Flask(__name__)

@api.route('/data')
def data():
    # db = PostgreDB('leetcodeRecord1', 'postgres', '1')
    # response_body = db.fetch_data_as_dict()
    # db.close()
    response_body = getLeetcodeData()
    return response_body