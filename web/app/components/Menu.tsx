import { use, useEffect, useState } from "react";
import { Input, Switch } from "antd";
import { Mic, MicOff } from "lucide-react";
const { Search, Password } = Input;
import { message } from "antd";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { renderToString } from "react-dom/server";
import { listHistory, updateApiKey } from "~/api/api-service";
export function RichTextEditor({ content }: any) {
  const [value, setValue] = useState("<p>点击这里开始编辑</p>");
  const [preValue, setPreValue] = useState<Array<any>>([]);
  useEffect(() => {
    if (preValue.length === content.length) {
    }
    const contentList = content.map(([sentence_id, text]: any) => (
      <p key={sentence_id}>{text}</p>
    ));
    setValue(renderToString(contentList));
    console.log(renderToString(contentList));
  }, [content]);
  return (
    <ReactQuill
      value={value}
      onChange={setValue}
      theme="snow" // 使用 snow 主题
    />
  );
}
export const WhiteBoard = ({ content }: any) => {
  console.log(content);
  return (
    <div className="flex-1">
      <ul className={"pl-5"}>
        {content.map(([sentence_id, text]: any) => (
          <li>{text}</li>
        ))}
      </ul>
    </div>
  );
};
export const MicButton = ({ toggleRecording, recording }: any) => {
  return (
    <div>
      <button
        onClick={toggleRecording}
        className={`p-4 rounded-full shadow-md transition-all duration-300 ease-in-out
  ${recording ? "bg-red-500 animate-pulse" : "bg-gray-300 hover:bg-gray-400"}`}
      >
        {recording ? (
          <MicOff className="text-wrhite w-6 h-6" />
        ) : (
          <Mic className="text-black w-6 h-6" />
        )}
      </button>
    </div>
  );
};
export const StreamSwitch = ({ handleSwitch }: any) => {
  return (
    <Switch
      checkedChildren="扬声器"
      unCheckedChildren="麦克风"
      onChange={handleSwitch}
    />
  );
};
export const ApiInput = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const handleSubmit = (apiKey: string) => {
    listHistory().then((res) => {
      console.log(res);
    });
    updateApiKey(apiKey).then((res) => {
      console.log(res);
      message.success("api key设置成功!");
    });
  };
  return (
    <Search
      className="col-span-2"
      placeholder="请输入百炼平台的api key"
      enterButton="提交"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSubmit(apiKey);
        }
      }}
      onChange={(e) => {
        setApiKey(e.target.value);
      }}
      onSearch={handleSubmit}
      value={apiKey}
    ></Search>
  );
};
