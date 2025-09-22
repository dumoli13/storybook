import React from 'react';
import { Editor, Text, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import cx from 'classnames';
import { CustomElement } from '.';

interface RichTextColorPickerProps {
  disabled: boolean;
}

const RichTextColorPicker = ({ disabled }: RichTextColorPickerProps) => {
  const editor = useSlate();
  const color = Editor.marks(editor)?.color || '#000000';
  const pickerRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (newColor: string) => {
    if (!editor.selection) return;

    Transforms.setNodes(
      editor,
      { color: newColor },
      {
        match: (n: CustomElement) => Text.isText(n),
        split:
          Editor.range(editor, editor.selection).anchor !==
          Editor.range(editor, editor.selection).focus,
        at: editor.selection,
      },
    );
  };

  const handleChooseColor = React.useCallback(() => {
    pickerRef.current?.click();
  }, []);

  return (
    <div
      role="button"
      onClick={handleChooseColor}
      className={cx(
        'shrink-0 flex items-center justify-center h-8 w-8 rounded-md relative',
        {
          'hover:border border-neutral-40': !disabled,
          'cursor-not-allowed': disabled,
        },
      )}
    >
      <label
        className={cx(
          'text-20px font-bold leading-none border-b-3 text-neutral-100 dark:text-neutral-100-dark',
          {
            'cursor-not-allowed': disabled,
          },
        )}
        style={{ borderColor: color }}
      >
        <span>A</span>
        <input
          type="color"
          value={color}
          onChange={(e) => handleChange(e.target.value)}
          className={cx('w-0 h-0 border-neutral-10 left-10', {
            'cursor-not-allowed': disabled,
          })}
          ref={pickerRef}
          disabled={disabled}
        />
      </label>
    </div>
  );
};

export default RichTextColorPicker;
