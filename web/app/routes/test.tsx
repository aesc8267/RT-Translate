import { useTest } from "~/hooks/test"
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const Editor = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "sskskdfljskflslkdfjk",
  });

  return (
    <div className="min-h-screen bg-white px-16 py-8">
      <EditorContent editor={editor} />
    </div>
  );
};
const test=()=>{
    const {setTemp}=useTest()
    const handleClick=()=>{
        setTemp(
            prev=>prev+1
        )
    }
    const handleSubmit=(value:string)=>{
        console.log(value)
    }
return (
    <div>
        <Editor/>
    </div>
)
}
export default test