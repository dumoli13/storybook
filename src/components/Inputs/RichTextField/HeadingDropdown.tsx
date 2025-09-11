import React, { useState } from 'react';
import { AutoComplete } from 'mis-design';
import { Editor, Element } from 'slate';
import { useSlate } from 'slate-react';

const HeadingDropdown: React.FC = () => {
  const editor = useSlate();

  const headings = [
    { label: 'Heading 1', value: 'heading-one' },
    { label: 'Heading 2', value: 'heading-two' },
    { label: 'Heading 3', value: 'heading-three' },
    { label: 'Heading 4', value: 'heading-four' },
    { label: 'Heading 5', value: 'heading-five' },
    { label: 'Heading 6', value: 'heading-six' },
    { label: 'Normal', value: 'paragraph' },
  ];

  const [value, setValue] = useState(headings[6]);

  React.useEffect(() => {
    if (!editor.selection) return;

    const [match] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && 'type' in n,
    });

    const type = match ? (match[0] as any).type : 'paragraph';
    const headingOption = headings.find((h) => h.value === type) || headings[6];
    setValue(headingOption);
  }, [editor.selection]);

  return (
    <div className="w-40">
      <AutoComplete
        placeholder="Select heading..."
        options={headings}
        value={value}
        onChange={(selected) => {
          if (selected) {
            setValue(selected);
            toggleBlock(editor, selected.value as any);
          }
        }}
        size="default"
      />
    </div>
  );
};

export default HeadingDropdown;
