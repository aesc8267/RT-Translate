from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import pymongo

app = Flask(__name__)
CORS(app, origin='*')
client = pymongo.MongoClient('mongodb://localhost:27017')
db = client['rt-translate']


@app.route('/message/add', methods=['POST'])
def add_message():
    coll = db['messages']
    message = request.get_json()
    print(message)
    try:
        coll.insert_one(message)
    except pymongo.errors.DuplicateKeyError:
        return 'Message already exists', 400
    return 'Success!', 200


@app.route('/message/list')
def list_messages():
    coll = db['messages']
    messages = coll.find({},{'_id':0}).to_list()
    return {"data": messages}, 200


if __name__ == '__main__':
    app.run(debug=True)
