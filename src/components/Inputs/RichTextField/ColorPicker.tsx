import { useRef } from 'react';
import { Editor, Text, Transforms } from 'slate';
import { useSlate } from 'slate-react';

interface ColorPickerProps {
  color: string;
  onChange: (value: string) => void;
}

const setColor = (editor: Editor, color: string) => {
  if (!editor.selection) return;

  Transforms.setNodes(
    editor,
    { color },
    { match: (n) => Text.isText(n), split: true, at: editor.selection },
  );
};

const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const editor = useSlate();
  const pickerRef = useRef<HTMLInputElement>(null);

  const handleChange = (newColor: string) => {
    setColor(editor, newColor);
    onChange(newColor);
  };

  return (
    <div className="h-8 w-8 flex flex-col items-center justify-center">
      <button
        type="button"
        className="text-base font-bold select-none leading-none border-b-2"
        style={{ borderColor: color }}
        onClick={() => pickerRef.current?.click()}
      >
        A
      </button>
      <input
        type="color"
        value={color}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-neutral-10 w-full h-0 invisible"
        ref={pickerRef}
      />
    </div>
  );
};

export default ColorPicker;
