import React from 'react';
import { Element, Transforms } from 'slate';
import { RenderElementProps, useSlate } from 'slate-react';
import { CustomElement } from '.';
import { Popper } from '../../Displays';
import Button from '../Button';
import Icon from '../../Icon';
import TextField from '../TextField';
import Form from '../Form';

interface RichTextImageThumbnailProps
  extends Omit<RenderElementProps, 'element'> {
  element: CustomElement;
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
  console.log('RichTextLinkViewer', editor.children);
  const { hyperlink, title } = element.link;

  const [openViewer, setOpenViewer] = React.useState(false);
  const closeModal = () => setOpenViewer(false);

  const handleOpenLink = () => {
    window.open(hyperlink, '_blank');
  };

  const handleSubmit = (value: FormData) => {
    Transforms.setNodes(
      editor,
      {
        link: {
          hyperlink: value.hyperlink,
          title: value.title || value.hyperlink,
        },
      } as CustomElement,
      {
        match: (n) => Element.isElement(n),
        split: true,
      },
    );
    closeModal();
  };

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
        contentEditable={false}
        className="underline"
        style={element.style}
        onClick={() => setOpenViewer(true)}
      >
        {title || hyperlink}
      </span>
    </Popper>
  );
};

export default RichTextLinkViewer;
