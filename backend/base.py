from flask import Flask
from readGoogleSheet import getLeetcodeData

api = Flask(__name__)

@api.route('/getData')
def getData():
    response_body = getLeetcodeData()
    return response_body