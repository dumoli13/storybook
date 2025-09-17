import React from "react";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { RichTextRenderElementProps } from ".";
import ImageViewer from "../../Displays/ImageViewer";

const RichTextImageThumbnail = ({
  attributes,
  element,
}: RichTextRenderElementProps) => {
  const editor = useSlate();
  const [openViewer, setOpenViewer] = React.useState(false);

  const openModal = () => setOpenViewer(true);
  const closeModal = () => setOpenViewer(false);

  return (
    <div {...attributes} contentEditable={false} className="relative w-fit">
      <img
        src={element.url}
        alt={element.title || ""}
        className="object-contain max-h-[200px]"
        onClick={openModal}
      />
      <button
        type="button"
        onClick={() => {
          const path = ReactEditor.findPath(editor, element);
          Transforms.removeNodes(editor, { at: path });
        }}
        className="w-7 h-7 absolute -top-4 -left-4 px-1.5 py-0.5 rounded-full text-neutral-50 dark:text-neutral-50-dark hover:text-neutral-70 dark:hover:text-neutral-70-dark hover:ring ring-neutral-70 dark:ring-neutral-70-dark"
      >
        ✕
      </button>
      <ImageViewer open={openViewer} onClose={closeModal} url={element.url} />
    </div>
  );
};

export default RichTextImageThumbnail;
