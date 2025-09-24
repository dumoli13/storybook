import React from 'react';
import { Editor, Element, Transforms } from 'slate';
import { ReactEditor, RenderElementProps, useSlate } from 'slate-react';
import { LinkElement } from '.';
import { Popper } from '../../Displays';
import Button from '../Button';
import Icon from '../../Icon';
import TextField from '../TextField';
import Form from '../Form';

interface RichTextImageThumbnailProps
  extends Omit<RenderElementProps, 'element'> {
  element: LinkElement;
}

type FormData = {
  hyperlink: string;
  title: string;
};

const RichTextLinkViewer = ({
  attributes,
  element,
}: RichTextImageThumbnailProps) => {
  const editor = useSlate();
  const { hyperlink, title } = element.link;

  const [openViewer, setOpenViewer] = React.useState(false);
  const closeModal = () => setOpenViewer(false);

  const handleOpenPopper = (event: React.MouseEvent) => {
    event.preventDefault();

    const linkEntries = Array.from(
      Editor.nodes(editor, {
        at: [],
        match: (n) =>
          Element.isElement(n) &&
          n.type === 'link' &&
          n.link?.hyperlink === element.link.hyperlink &&
          n.link?.title === element.link.title,
      }),
    );

    console.log('linkEntries', linkEntries);

    if (linkEntries.length > 0) {
      const [, path] = linkEntries[0];

      // Set selection to this specific link
      Transforms.select(editor, {
        anchor: Editor.start(editor, path),
        focus: Editor.end(editor, path),
      });

      // Optional: Also set the editor selection state
      ReactEditor.focus(editor);
    }

    setOpenViewer(true);
  };

  const handleOpenLink = () => {
    window.open(hyperlink, '_blank');
  };

  const handleSubmit = (value: FormData) => {
    console.log('editor.selection', editor.selection);
    Transforms.setNodes(
      editor,
      {
        link: {
          hyperlink: value.hyperlink.trim(),
          title: value.title.trim(),
        },
      },
      {
        match: (n) => Element.isElement(n) && n.type === 'link',
      },
    );
    closeModal();
  };

  // return (
  //   <a
  //     {...attributes}
  //     href={(element as any).url}
  //     className="text-blue-600 underline cursor-pointer"
  //     target="_blank"
  //     rel="noreferrer"
  //     onClick={(e) => {
  //       e.preventDefault();
  //       window.open((element as any).url, '_blank');
  //     }}
  //   >
  //     {children}
  //   </a>
  // );

  return (
    <Popper
      placement="bottom-left"
      content={
        <Form
          onSubmit={handleSubmit}
          rules={{
            hyperlink: ['required'],
          }}
          className="p-4 grid grid-cols-1 gap-2 text-neutral-70 text-14px"
        >
          <TextField
            id="hyperlink"
            startIcon="URL"
            defaultValue={hyperlink}
            width={200}
            placeholder="Insert Hyperlink URL"
          />
          <TextField
            id="title"
            startIcon="Title"
            defaultValue={title}
            width={200}
            placeholder="Insert Title"
          />
          <div className="h-0 w-full border-b border-neutral-40 dark:border-neutral-40-dark my-1" />
          <div className="flex items-center justify-between gap-2">
            <Button
              title="Open Link"
              startIcon={<Icon name="arrow-up-right" strokeWidth={2} />}
              variant="outlined"
              onClick={handleOpenLink}
              size="small"
            >
              Open Link
            </Button>
            <Button size="small" variant="contained" type="submit">
              Save
            </Button>
          </div>
        </Form>
      }
      open={openViewer}
      onClickOutside={closeModal}
    >
      <span
        {...attributes}
        className="underline"
        style={element.style}
        onClick={handleOpenPopper}
      >
        {title || hyperlink}
      </span>
    </Popper>
  );
};

export default RichTextLinkViewer;
