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
        match: (n) => Element.isElement(n),
      }
    );
  };

  return (
    <RichTextToolbarButton
      active={isMarkActive}
      onMouseDown={toggleAlign}
      disabled={isMarkActive}
    >
      <Icon
        name={icon}
        size={20}
        className="text-neutral-100 dark:text-neutral-100-dark"
      />
    </RichTextToolbarButton>
  );
};

export default AlignButton;
