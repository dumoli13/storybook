import React from "react";
import { Popper } from "../../Displays";
import TextField from "../TextField";
import Button from "../Button";
import Icon from "../../Icon";
import { useSlate } from "slate-react";
import { Node, Range, Transforms } from "slate";

const RichTextLink = () => {
  const editor = useSlate();

  const [linkModalOpen, setLinkModalOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");
  const [linkName, setLinkName] = React.useState("");

  const handleSubmit = () => {
    const { selection } = editor;
    if (!selection) return;

    const isCollapsed = Range.isCollapsed(selection);
    if (!isCollapsed) {
      Transforms.wrapNodes(
        editor,
        { type: "link", url: linkUrl, children: [] },
        { split: true, at: selection }
      );
      Transforms.collapse(editor, { edge: "end" });
      Transforms.insertText(editor, " ");
    } else {
      const linkNode: Node = {
        type: "link",
        url: linkUrl,
        children: [{ text: linkName || linkUrl }],
      };
      Transforms.insertNodes(editor, linkNode);
      const { selection: newSel } = editor;
      if (newSel) {
        Transforms.move(editor, { distance: 1, unit: "offset" });
      }
      Transforms.insertText(editor, " ");
    }

    setLinkUrl("");
    setLinkName("");
    setLinkModalOpen(false);
  };

  return (
    <Popper
      offset={8}
      placement="bottom-left"
      open={linkModalOpen}
      onOpen={setLinkModalOpen}
      content={
        <div
          className="bg-neutral-10 p-2 rounded shadow-md z-50 flex flex-col gap-2 w-64"
          onClick={(e) => e.stopPropagation()}
        >
          <TextField
            labelPosition="top"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={setLinkUrl}
            size="default"
          />
          <TextField
            labelPosition="top"
            placeholder="Enter Link Name"
            value={linkName}
            onChange={setLinkName}
            size="default"
          />
          <div className="flex justify-end gap-2">
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              size="small"
              disabled={!linkUrl}
            >
              Insert
            </Button>
          </div>
        </div>
      }
    >
      <div className="shrink-0 w-8 h-8 flex items-center justify-center hover:border border-neutral-40 bg-neutral-10 dark:bg-neutral-10-dark rounded-md">
        <Icon
          name="link"
          size={20}
          className="text-neutral-100 dark:text-neutral-100-dark"
          onClick={() => setLinkModalOpen(true)}
        />
      </div>
    </Popper>
  );
};

export default RichTextLink;
