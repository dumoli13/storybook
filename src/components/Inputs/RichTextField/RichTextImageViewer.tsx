import React from 'react';
import { Element, Transforms } from 'slate';
import { ReactEditor, RenderElementProps, useSlate } from 'slate-react';
import { CustomElement } from '.';
import ImageViewer from '../../Displays/ImageViewer';
import { Popper } from '../../Displays';
import NumberTextField from '../NumberTextField';
import Button from '../Button';
import Icon from '../../Icon';
import IconButton from '../IconButton';
import { DOMEditor } from 'slate-dom';
import TextField from '../TextField';
import Form from '../Form';

interface RichTextImageThumbnailProps
  extends Omit<RenderElementProps, 'element'> {
  element: CustomElement;
}

type FormData = {
  width: number;
  height: number;
  title: string;
  hyperlink: string;
};

const RichTextImageViewer = ({
  attributes,
  element,
}: RichTextImageThumbnailProps) => {
  const editor = useSlate();
  const {
    width,
    height,
    url,
    title,
    hyperlink,
    originalHeight,
    originalWidth,
  } = element.image;
  const [widthValue, setWidthValue] = React.useState(width);
  const [heightValue, setHeightValue] = React.useState(height);

  const [openViewer, setOpenViewer] = React.useState<
    'viewer' | 'option' | null
  >(null);
  const closeModal = () => setOpenViewer(null);

  const handleRemove = () => {
    const path = ReactEditor.findPath(editor as DOMEditor, element);
    Transforms.removeNodes(editor, { at: path });
  };

  const handleBlur = (id: 'width' | 'height') => () => {
    if (id === 'width') {
      setHeightValue(Math.ceil((originalHeight / originalWidth) * widthValue));
    } else if (id === 'height') {
      setWidthValue(Math.ceil((originalWidth / originalHeight) * heightValue));
    }
  };

  const handleSubmit = (value: FormData) => {
    Transforms.setNodes(
      editor,
      {
        image: {
          ...element.image,
          width: value.width,
          height: value.height,
          title: value.title,
          hyperlink: value.hyperlink,
        },
      } as CustomElement,
      {
        match: (n) => Element.isElement(n),
      },
    );
    closeModal();
  };

  return (
    <div {...attributes} contentEditable={false} className="relative w-fit">
      <Popper
        placement="top-left"
        open={openViewer === 'option'}
        onClickOutside={closeModal}
        content={
          <Form
            onSubmit={handleSubmit}
            rules={{
              width: ['required'],
              height: ['required'],
              title: ['required'],
            }}
            className="p-4 grid grid-cols-1 gap-2 text-neutral-70 text-14px"
          >
            <NumberTextField
              id="width"
              startIcon="Width"
              endIcon="px"
              value={widthValue}
              onChange={setWidthValue}
              width={200}
              placeholder="Insert Width"
              onBlur={handleBlur('width')}
            />
            <NumberTextField
              id="height"
              startIcon="Height"
              endIcon="px"
              value={heightValue}
              onChange={setHeightValue}
              width={200}
              onBlur={handleBlur('height')}
              placeholder="Insert Height"
            />
            <div className="h-0 w-full border-b border-neutral-40 dark:border-neutral-40-dark my-1" />
            <TextField
              id="title"
              startIcon="Title"
              defaultValue={title}
              width={200}
              placeholder="Insert Title"
            />
            <TextField
              id="hyperlink"
              startIcon="URL"
              defaultValue={hyperlink}
              width={200}
              placeholder="Insert Hyperlink URL"
            />
            <div className="h-0 w-full border-b border-neutral-40 dark:border-neutral-40-dark my-1" />
            <div className="flex items-center justify-between gap-2">
              <IconButton
                title="Remove"
                icon={<Icon name="trash" strokeWidth={2} />}
                color="danger"
                onClick={handleRemove}
                size="small"
              />
              <Button size="small" variant="contained" type="submit">
                Save
              </Button>
            </div>
          </Form>
        }
      >
        <div title="View Image" className="group">
          <div
            className="group-hover:bg-neutral-100/50 absolute top-0 left-0 right-0 bottom-0"
            onClick={() => setOpenViewer('option')}
          />
          <div
            role="button"
            title="View Image Full Screen"
            onClick={() => setOpenViewer('viewer')}
            className="hidden group-hover:block p-2 rounded-md hover:ring-4 ring-neutral-10 text-neutral-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Icon name="arrows-pointing-out" size={46} strokeWidth={2} />
          </div>
          <img
            src={url}
            alt={title}
            className="object-contain"
            style={{
              maxWidth: width,
              maxHeight: height,
            }}
          />
        </div>
      </Popper>
      <ImageViewer
        open={openViewer === 'viewer'}
        onClose={closeModal}
        url={url}
      />
    </div>
  );
};

export default RichTextImageViewer;
