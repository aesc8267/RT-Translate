import React, {useEffect, useState} from "react";
import io, {Socket} from "socket.io-client";
import {Button} from "antd";

const ws_url = "http://localhost:5000";
import {v4 as uuid} from 'uuid';

const AudioSocketClient: React.FC = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
        null
    );
    const [isRecording, setIsRecording] = useState(false);
    useEffect(() => {
        const new_socket = io(ws_url, {
            transports: ["websocket"],
            reconnectionAttempts: 5,
            extraHeaders: {}
        });
        setSocket(new_socket);
        new_socket.on("connect", () => {
            console.log("connected to ws server");
        });
        new_socket.on("disconnect", () => {
            console.log("disconnected from ws server");
        });
        new_socket.on("server_response", (data: any) => {
            console.log("server_response", data);
        });
        return () => {
            new_socket.disconnect();
        };
    }, []);
        function convertFloat32ToInt16(buffer) {
          const l = buffer.length;
          const result = new Int16Array(l);
          for (let i = 0; i < l; i++) {
            const s = Math.max(-1, Math.min(1, buffer[i]));
            result[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          }
          return new Uint8Array(result.buffer);
        }

    const sendAudioData = (data: ArrayBuffer) => {
        if (socket && socket.connected) {
            socket.emit("audio_data", data);
        } else {
            console.warn("socket not connected");
        }
    };
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            // 获取原始 PCM 数据（采样率可选 16000）
            const audioCtx = new AudioContext({ sampleRate: 16000 });
            const source = audioCtx.createMediaStreamSource(stream);
            const processor = audioCtx.createScriptProcessor(4096, 1, 1);

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0); // Float32Array
              const pcmData = floatTo16BitPCM(inputData);
              sendAudioData(pcmData)
            };

            source.connect(processor);
            processor.connect(audioCtx.destination);


            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };
    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            // setMediaRecorder(null); // 停止录制后，重置MediaRecorder？？
            setIsRecording(false);
        }
    };
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-2">Socket.IO Client</h1>
            <p>当前连接状态:{socket?.connected ? "已连接" : "未连接"}</p>
            <button
                className={`px-4 py-2 ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white rounded-md`}
                onClick={isRecording ? stopRecording : startRecording}
            >
                {isRecording ? '停止录音' : '开始录音'}
            </button>
        </div>
    );
};
export default AudioSocketClient;
