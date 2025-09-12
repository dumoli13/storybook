import React from "react";
import { useSlate } from "slate-react";
import { RichElementDetail } from ".";
import RichTextToolbarButton from "./RichTextToolbarButton";
import Icon, { IconNames } from "../../Icon";
import { Editor, Element, Transforms } from "slate";
import { isListType, isTextTag } from "../../../libs/richTextField";
import { LIST_TYPES } from "../../../types/richTextField";

interface BlockButtonProps {
  format: LIST_TYPES;
  icon: IconNames;
}

export enum TEXT_TAG {
  Paragraph = "paragraph",
  HeadingOne = "heading-one",
  HeadingTwo = "heading-two",
  HeadingThree = "heading-three",
  HeadingFour = "heading-four",
  HeadingFive = "heading-five",
  HeadingSix = "heading-six",
  BlockQuote = "block-quote",
}

const BlockButton = ({ format, icon }: BlockButtonProps) => {
  const editor = useSlate();

  const [match] = Editor.nodes(editor, {
    match: (n) => {
      if (!Element.isElement(n)) return false;
      if (n.type === format) return true;
      if (n.type === "list-item" && (n as any).heading === format) return true;
      return false;
    },
  });
  const isActive = !!match;

  const handleToggleBlock = (e: React.MouseEvent) => {
    e.preventDefault();

    const [parentList] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === format,
    });
    const isActive = !!parentList;

    console.log("isActive", isActive);
    if (isActive) {
      for (const [node, path] of Editor.nodes(editor, {
        match: (n) => Element.isElement(n) && n.type === "list-item",
      })) {
        const li = node as any;
        const newType = li.heading ?? "paragraph";

        Transforms.setNodes(
          editor,
          { type: newType, heading: undefined },
          { at: path }
        );
      }

      Transforms.unwrapNodes(editor, {
        match: (n) => Element.isElement(n) && isListType(n.type),
        split: true,
      });

      for (const [node, path] of Editor.nodes(editor, {
        at: [],
        match: (n) =>
          Element.isElement(n) &&
          isListType(n.type) &&
          Editor.isEmpty(editor, n),
      })) {
        Transforms.removeNodes(editor, { at: path });
      }
    } else {
      const [match] = Editor.nodes(editor, {
        match: (n) => Element.isElement(n) && isTextTag(n.type),
      });
      const currentHeading = match ? (match[0] as any).type : undefined;

      Transforms.setNodes(
        editor,
        { type: "list-item", heading: currentHeading },
        {
          match: (n) => Element.isElement(n) && isTextTag(n.type),
        }
      );

      Transforms.unwrapNodes(editor, {
        match: (n) => Element.isElement(n) && isListType(n.type),
        split: true,
      });

      Transforms.wrapNodes(
        editor,
        { type: format, children: [] } as RichElementDetail,
        { match: (n) => Element.isElement(n) && n.type === "list-item" }
      );
    }
  };

  return (
    <RichTextToolbarButton active={isActive} onMouseDown={handleToggleBlock}>
      <Icon name={icon} size={16} />
    </RichTextToolbarButton>
  );
};

export default BlockButton;
