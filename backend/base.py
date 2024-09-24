from flask import Flask

api = Flask(__name__)

@api.route('/googleSheetData')
def googleSheetData():

    
    response_body = {
        "name": "Nagato",
        "about" :"Hello! I'm a full stack developer that loves python and javascript"
    }

    return response_body