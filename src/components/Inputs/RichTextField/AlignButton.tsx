import React from "react";
import Icon, { IconNames } from "../../Icon";
import RichTextToolbarButton from "./RichTextToolbarButton";
import { useSlate } from "slate-react";
import { Editor, Element, Transforms } from "slate";

interface AlignButtonProps {
  align: "left" | "center" | "right" | "justify";
  icon: IconNames;
}

const AlignButton = ({ align, icon }: AlignButtonProps) => {
  const editor = useSlate();
  const [match] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && "type" in n,
  });
  const isMarkActive = (match?.[0].align || "left") === align;

  const toggleAlign = (e: React.MouseEvent) => {
    e.preventDefault();

    Transforms.setNodes(
      editor,
      { align },
      {
        match: (n) =>
          Element.isElement(n) &&
          [
            "paragraph",
            "heading-one",
            "heading-two",
            "block-quote",
            "list-item",
          ].includes(n.type),
      }
    );
  };

  return (
    <RichTextToolbarButton active={isMarkActive} onMouseDown={toggleAlign}>
      <Icon name={icon} size={20} />
    </RichTextToolbarButton>
  );
};

export default AlignButton;
