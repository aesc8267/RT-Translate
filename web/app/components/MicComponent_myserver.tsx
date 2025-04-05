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
            // const recorder = new MediaRecorder(stream, {
            //             //     mimeType: "audio/webm;codecs=opus",
            //             // });
            //             // recorder.ondataavailable = (event) => {
            //             //     if (event.data.size > 0 && socket && socket.connected) {
            //             //         event.data.arrayBuffer().then((buffer) => {
            //             //             console.log("sendAudioData", buffer);
            //             //             sendAudioData(buffer);
            //             //         });
            //             //     }
            //             // };
            //             // recorder.start(500);
            // setMediaRecorder(recorder);

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
