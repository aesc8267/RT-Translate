import dashscope
from dashscope.audio.asr import *
import os
import requests
from http import HTTPStatus
from dotenv import load_dotenv


class Callback(TranslationRecognizerCallback):
    def __init__(self, on_message_callback):
        self.on_message_callback = on_message_callback
        self.transcription_list = []

    def on_open(self) -> None:
        print("TranslationRecognizerCallback open")

    def on_close(self) -> None:
        print("TranslationRecognizerCallback close")

    def on_event(self, request_id, transcription_result: TranscriptionResult,
                 translation_result: TranslationResult, usage) -> None:
        # print("request id: ", request_id)
        # print("usage: ", usage)
        # if translation_result is not None:
        #     print(
        #         "translation_languages: ",
        #         translation_result.get_language_list(),
        #     )
        #     english_translation = translation_result.get_translation("en")
        #     print("sentence id: ", english_translation.sentence_id)
        #     print("translate to english: ", english_translation.text)
        #     if english_translation.stash is not None:
        #         print(
        #             "translate to english stash: ",
        #             translation_result.get_translation("en").stash.text,
        #         )
        # if transcription_result is not None:
        #     print("sentence id: ", transcription_result.sentence_id)
        #     print("transcription: ", transcription_result.text)
        #     if transcription_result.stash is not None:
        #         print("transcription stash: ", transcription_result.stash.text)
        result = {
            'request_id': request_id,
            'usage': usage,
        }
        if transcription_result is not None:
            result['transcription'] = {
                "sentence_id": transcription_result.sentence_id,
                "text": transcription_result.text
            }
        # if translation_result is not None:
        #     english_translation = translation_result.get_translation('zh')
        #     result['translation'] = {
        #         "sentence_id": english_translation.sentence_id,
        #         "text": english_translation.text
        #     }
        #     result['target_language']=translation_result.get_language_list(),
        self.on_message_callback(result,translation_result)

    def on_error(self, message) -> None:
        print('error: {}'.format(message))

    def on_complete(self) -> None:
        print('TranslationRecognizerCallback complete')

# callback = Callback()
# translator = TranslationRecognizerRealtime(
#     model="gummy-realtime-v1",
#     format="pcm",
#     sample_rate=16000,
#     callback=callback
# )
#
# translator.start()
#
# try:
#     audio_data: bytes = None
#     f = open("audio_data.pcm", 'rb')
#     if os.path.getsize("audio_data.pcm"):
#         while True:
#             audio_data = f.read(12800)
#             if not audio_data:
#                 break
#             else:
#                 print(translator.send_audio_frame(audio_data))
#     else:
#         raise Exception(
#             'The supplied file was empty (zero bytes long)')
#     f.close()
# except Exception as e:
#     raise e
#
# translator.stop()

# result = translator.call("audio_data.pcm")
# if not result.error_message:
#     print("request id: ", result.request_id)
#     print("transcription: ")
#     for transcription_result in result.transcription_result_list:
#         print(transcription_result.text)
#     print("translation[en]: ")
#
#     for translation_result in result.translation_result_list:
#         if translation_result is None:
#             continue
#         print(translation_result.get_translation('en').text)
# else:
#     print("Error: ", result.error_message)
# print(callback.transcription_list)
