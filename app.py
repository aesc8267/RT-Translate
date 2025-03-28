from flask import Flask, render_template, request,jsonify
from flask_socketio import SocketIO, emit
app=Flask(__name__)
socketio=SocketIO(app)
socketio.init_app(app,cors_allowed_origins='*')
namespace='/'

@app.route('/',methods=['GET', 'POST'])
def index():
    return jsonify({'message':'Hello World'})
@socketio.on('connect', namespace=namespace)
def handle_connect():
    print('Client connected')
@socketio.on('message',namespace=namespace)
def handle_message(message):
    print('Received message: ' + message)
    emit('response', {'data': 'Message received!'})
if __name__=='__main__':
    socketio.run(app,debug=True)