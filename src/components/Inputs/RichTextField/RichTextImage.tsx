import React from "react";
import Icon from "../../Icon";
import RichTextToolbarButton from "./RichTextToolbarButton";
import { useSlate } from "slate-react";
import { Transforms } from "slate";
import { RichElementDetail } from ".";

const RichTextImage = () => {
  const editor = useSlate();

  const InsertImageFromFile = (e: React.MouseEvent) => {
    e.preventDefault();

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = () => {
      const files = input.files;
      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = () => {
            const url = reader.result as string;
            const img = new Image();
            img.onload = () => {
              const width = img.naturalWidth;
              const height = img.naturalHeight;

              Transforms.insertNodes(editor, {
                type: "image",
                url,
                title: file.name,
                width,
                height,
                children: [{ text: "" }],
              } as RichElementDetail);

              Transforms.insertNodes(editor, {
                type: "paragraph",
                children: [{ text: "" }],
              } as RichElementDetail);
            };
            img.src = url;
          };
          reader.readAsDataURL(file);
        });
      }
    };
    input.click();
  };

  return (
    <RichTextToolbarButton onMouseDown={InsertImageFromFile}>
      <Icon
        name="photo"
        size={20}
        className="text-neutral-100 dark:text-neutral-100-dark"
      />
    </RichTextToolbarButton>
  );
};

export default RichTextImage;
