import React from "react";
import { Editor, Element, Transforms } from "slate";
import { useSlate } from "slate-react";
import AutoComplete from "../AutoComplete";
import { RichElementDetail } from ".";
import { isTextTag } from "../../../libs/richTextField";
import { TEXT_TAG } from "../../../types/richTextField";
import { SelectValue } from "../../../types";

const headings = [
  { label: "Heading 1", value: "heading-one" },
  { label: "Heading 2", value: "heading-two" },
  { label: "Heading 3", value: "heading-three" },
  { label: "Heading 4", value: "heading-four" },
  { label: "Heading 5", value: "heading-five" },
  { label: "Heading 6", value: "heading-six" },
  { label: "Normal", value: "paragraph" },
];

const isBlockActive = (editor: Editor, format: RichElementDetail["type"]) => {
  const [match] = Editor.nodes(editor, {
    match: (n: RichElementDetail) => {
      if (!Element.isElement(n)) return false;

      if (n.type === format) return true;

      if (n.type === "list-item" && (n as any).heading === format) return true;

      return false;
    },
  });

  return !!match;
};

const RichTextTag = () => {
  const editor = useSlate();
  const [value, setValue] = React.useState(headings[6]);

  React.useEffect(() => {
    if (!editor.selection) return;

    const [match] = Editor.nodes(editor, {
      match: (n: RichElementDetail) => Element.isElement(n),
    });

    const type = match ? (match[0] as any).type : "paragraph";
    const headingOption = headings.find((h) => h.value === type) || headings[6];
    setValue(headingOption);
  }, [editor.selection]);

  const handleToggleBlock = (value: SelectValue<string, undefined>) => {
    if (!value) return;

    setValue(value);
    const format = value.value as TEXT_TAG;

    const [matchListItem] = Editor.nodes(editor, {
      match: (n: RichElementDetail) =>
        Element.isElement(n) && n.type === "list-item",
    });

    const isActive = isBlockActive(editor, format);
    console.log("isActive", matchListItem, isActive, format);

    if (matchListItem && format.startsWith("heading")) {
      Transforms.setNodes(editor, { heading: format } as any, {
        match: (n: RichElementDetail) =>
          Element.isElement(n) && n.type === "list-item",
      });
    } else {
      Transforms.setNodes(
        editor,
        { type: isActive ? "paragraph" : format },
        {
          match: (n: RichElementDetail) =>
            Element.isElement(n) && isTextTag(n.type),
          split: true,
        }
      );
    }
  };

  return (
    <div className="w-40">
      <AutoComplete
        placeholder="Select heading..."
        options={headings}
        value={value}
        onChange={handleToggleBlock}
        size="default"
      />
    </div>
  );
};

export default RichTextTag;
