import { use, useEffect, useState } from "react";
import { useAudioStream } from "~/hooks/useAudioStream";
import { Mic, MicOff } from "lucide-react";
import { message, Radio, Switch } from "antd";
import Search from "antd/es/input/Search";
import { Flex, Splitter, Typography } from "antd";
import type { SplitterProps } from "antd";
import { listHistory, updateLanguage } from "~/api/api-service";
import { v4 } from "uuid";
import {
  ApiInput,
  MicButton,
  RichTextEditor,
  StreamSwitch,
  WhiteBoard,
} from "~/components/Menu";
const Desc: React.FC<Readonly<{ text?: string | number }>> = (props) => (
  <Flex justify="center" align="center" style={{ height: "100%" }}>
    <Typography.Title
      type="secondary"
      level={5}
      style={{ whiteSpace: "nowrap" }}
    >
      {props.text}
    </Typography.Title>
  </Flex>
);

const CustomSplitter: React.FC<Readonly<any>> = ({
  transcriptionText,
  translationText,
  sourceLanguage,
  setSourceLanguage,
  targetLanguage,
  setTargetLanguage,
  style,
  ...restProps
}) => {
  return (
    <Splitter
      style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", ...style }}
      {...restProps}
    >
      <Splitter.Panel collapsible min="20%">
        {/* <Desc text="First" /> */}
        <div className="pl-3">
          <Radio.Group
            value={sourceLanguage}
            onChange={(e) => {
              setSourceLanguage(e.target.value);
            }}
            buttonStyle="solid"
          >
            <Radio.Button value="auto">Auto</Radio.Button>
            <Radio.Button value="zh">中文</Radio.Button>
            <Radio.Button value="en">English</Radio.Button>
            <Radio.Button value="ja">日本語</Radio.Button>
            <Radio.Button value="None">None</Radio.Button>
          </Radio.Group>
        </div>
        {/* <RichTextEditor content={translationText}/> */}
        <WhiteBoard content={transcriptionText} />
      </Splitter.Panel>
      <Splitter.Panel collapsible>
        {/* <Desc text="Second" /> */}
        <div className="pl-3">
          <Radio.Group
            value={targetLanguage}
            buttonStyle="solid"
            onChange={(e) => {
              setTargetLanguage(e.target.value);
            }}
          >
            <Radio.Button value="zh">中文</Radio.Button>
            <Radio.Button value="en">英语</Radio.Button>
            <Radio.Button value="ja">日语</Radio.Button>
            <Radio.Button value="None">None</Radio.Button>
          </Radio.Group>
        </div>
        <WhiteBoard content={translationText} />
      </Splitter.Panel>
    </Splitter>
  );
};
export const Main = () => {
  const { startRecording, stopRecording, toggleStream, setToggleStream } =
    useAudioStream((data: LLMResponse) => {
      const { usage, translation, transcription } = data;
      if (translation) {
        setTranslationText((prevState) => ({
          ...prevState,
          [translation.sentence_id]: translation.text,
        }));
      }
      if (transcription) {
        setTranscriptionText((preState) => ({
          ...preState,
          [transcription.sentence_id]: transcription.text,
        }));
      }
    });
  const [recording, setRecording] = useState(false);
  // const{text,setText} = useState({})
  const [translationText, setTranslationText] = useState<object>({});
  const [transcriptionText, setTranscriptionText] = useState<object>({});
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("None");
  const toggleRecording = async () => {
    if (recording) {
      stopRecording();
      setRecording(false);
    } else {
      if(sourceLanguage === "None" && targetLanguage === "None"){
        message.error("语音识别和翻译不能同时为None")
        return
      }
      await updateLanguage(sourceLanguage,targetLanguage)
      await startRecording();
      clearHistory();
      setRecording(true);
    }
  };
  const clearHistory = () => {
    setTranslationText({});
    setTranscriptionText({});
  };
  return (
    <div>
      <div className="flex  justify-between items-center p-2 pl-3">
        <div className=" flex flex-col gap-3 justify-between">
          <MicButton toggleRecording={toggleRecording} recording={recording} />
          <StreamSwitch handleSwitch={() => setToggleStream(!toggleStream)} />
        </div>
        <div className="">
          <ApiInput />
        </div>
      </div>

      <CustomSplitter
        transcriptionText={Object.entries(transcriptionText)}
        translationText={Object.entries(translationText)}
        sourceLanguage={sourceLanguage}
        setSourceLanguage={setSourceLanguage}
        targetLanguage={targetLanguage}
        setTargetLanguage={setTargetLanguage}
        style={{ height: 600 }}
      />
    </div>
  );
};
