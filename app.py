from flask import Flask, render_template, request, jsonify,Response
from flask_socketio import SocketIO, emit
from callbacks import Callback
from dashscope.audio.asr import TranslationRecognizerRealtime
import dashscope
import pymongo
import os
from flask_cors import CORS
from dotenv import load_dotenv
from flask import send_from_directory

load_dotenv()
# dashscope.api_key = os.getenv("DASHSCOPE_API_KEY")
client = pymongo.MongoClient("mongodb://localhost:27017")
db = client["rt-translate"]
collection = db["response"]
DIST_FOLDER='./web/build/client'
app = Flask(__name__,static_folder=DIST_FOLDER, static_url_path="")
CORS(app, origin='*')
socketio = SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")
target_language = "en"
source_language = "auto"


def send_client(chunk, translation_result):
    if translation_result is not None:
        english_translation = translation_result.get_translation(target_language)
        chunk["translation"] = {
            "sentence_id": english_translation.sentence_id,
            "text": english_translation.text,
        }
        chunk["target_language"] = (translation_result.get_language_list(),)
    socketio.emit("llm_result", chunk)
    collection.insert_one(chunk)


callback = Callback(send_client)


def init_translator():
    return TranslationRecognizerRealtime(
        model="gummy-realtime-v1",
        format="pcm",
        sample_rate=16000,
        callback=callback,
        source_language=source_language,
        translation_enabled=(target_language != "None"),
        transcription_enabled=(source_language != "None"),
        translation_target_languages=[target_language],
    )


translator = init_translator()


@socketio.on("connect")
def handle_connect():
    if not translator._running:
        translator.start()
    print("Client connected")


@socketio.on("message")
def handle_message(message):
    print("Received message: " + message)
    emit("response", {"data": "Message received!"})


@socketio.on("pcm_chunk")
def handle_audio_data(data):
    # data 为前端发送的二进制数据（例如 ArrayBuffer 转换后的数据）
    # print(f"接收到音频数据，大小: {len(data)} 字节")
    # 示例：将接收到的数据追加写入文件，便于后续处理或存储

    with open("audio_data.pcm", "ab") as f:
        f.write(data)
    try:
        translator.send_audio_frame(data)
    except Exception as e:
        raise e


@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")
    # print(translator._running)
    if translator._running:
        translator.stop()


@app.route("/api_key/set", methods=["POST"])
def set_apikey():
    data = request.get_json()
    # 获取请求中的 API 密钥
    api_key = data.get("api_key")
    print("hello", api_key)
    # 将 API 密钥存储到数据库中
    os.environ["DASHSCOPE_API_KEY"] = api_key
    dashscope.api_key = api_key
    return jsonify({"message": "API key set successfully"}), 200


@app.route("/history/list", methods=["GET"])
def list_history():
    # 从数据库中获取历史记录
    history = collection.find({}, {"_id": 0}).to_list()
    # 返回 JSON 格式的历史记录
    return jsonify(history)


@app.route("/language/update", methods=["POST"])
def set_language():
    global target_language, source_language
    data = request.get_json()
    target_language = data.get("target_language")
    source_language = data.get("source_language")
    global translator
    translator = init_translator()
    return jsonify({"message": "language set successfully"}), 200

@app.route("/")
def print_hello():
    return "hello world",200

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", ssl_context=('./web/localhost+3.pem','./web/localhost+3-key.pem'),debug=True)
