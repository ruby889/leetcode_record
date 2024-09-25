from flask import Flask
from readGoogleSheet import getLeetcodeData

api = Flask(__name__)

@api.route('/data')
def data():
    response_body = getLeetcodeData()
    return response_body