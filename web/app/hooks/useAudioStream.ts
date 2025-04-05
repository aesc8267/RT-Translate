import { useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useAudioStream = (
  onTranscription: (data: LLMResponse) => void
) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const [toggleStream, setToggleStream] = useState<boolean>(false);
  const startRecording = async () => {
    socketRef.current = io("http://localhost:5000");

    socketRef.current?.on("llm_result", (data: LLMResponse) => {
      console.log("llm_result", data);
      onTranscription?.(data);
    });

    let stream = null;
    let displayStream = null;
    if (toggleStream) {
      displayStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
      });
      const audioTracks = displayStream.getAudioTracks();
      if (!audioTracks.length) {
        console.log("no audio tracks");
        throw new Error("no audio tracks");
      }
      stream = new MediaStream(audioTracks);
    } else {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }
    // const stream = await navigator.mediaDevices.getUserMedia({audio: true});

    const audioCtx = new AudioContext({ sampleRate: 16000 });
    await audioCtx.audioWorklet.addModule("/pcm-processor.js");

    const worklet = new AudioWorkletNode(audioCtx, "pcm-processor");
    worklet.port.onmessage = (event) => {
      const pcmData = event.data as Int16Array<ArrayBufferLike>;
      const buffer = new Uint8Array(pcmData.buffer);
      socketRef.current?.emit("pcm_chunk", buffer);
    };

    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(worklet);
    worklet.connect(audioCtx.destination);

    audioCtxRef.current = audioCtx;
    streamRef.current = toggleStream ? displayStream : stream;
    workletRef.current = worklet;
  };

  const stopRecording = () => {
    socketRef.current?.disconnect();
    workletRef.current?.disconnect();
    audioCtxRef.current?.close().then((r) => {
      console.log("audioCtxRef.current?.close()", r);
    });
    streamRef.current?.getTracks().forEach((track) => track.stop());
  };

  return { startRecording, stopRecording,toggleStream,setToggleStream };
};
