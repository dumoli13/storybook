import React from "react";
import { Editor, Text, Transforms } from "slate";
import { useSlate } from "slate-react";

const RichTextColorPicker = () => {
  const editor = useSlate();
  const color = Editor.marks(editor)?.color || "#000000";
  const pickerRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (newColor: string) => {
    if (!editor.selection) return;

    Transforms.setNodes(
      editor,
      { color: newColor },
      { match: (n) => Text.isText(n), split: true, at: editor.selection }
    );
  };

  const handleChooseColor = () => {
    if (pickerRef.current) {
      pickerRef.current.value = "";
      pickerRef.current.click();
    }
  };

  return (
    <div
      role="button"
      onClick={handleChooseColor}
      className=" shrink-0 flex items-center justify-center h-8 w-8 hover:border border-neutral-40 rounded-md relative"
    >
      <label
        className="cursor-pointer text-20px font-bold leading-none border-b-3 text-neutral-100 dark:text-neutral-100-dark"
        style={{ borderColor: color }}
      >
        <span>A</span>
        <input
          type="color"
          value={color}
          onChange={(e) => handleChange(e.target.value)}
          className="w-0 h-0 border-neutral-10 left-10"
          ref={pickerRef}
        />
      </label>
    </div>
  );
};

export default RichTextColorPicker;
