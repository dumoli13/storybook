import React from 'react';
import { Popper } from '../../Displays';
import TextField from '../TextField';
import Button from '../Button';
import Icon from '../../Icon';
import { useSlate } from 'slate-react';
import { Range, Transforms } from 'slate';
import cx from 'classnames';
import { CustomElement } from '.';
import Form, { FormRef } from '../Form';
import RichTextToolbarButton from './RichTextToolbarButton';
import { FormProps } from 'react-router-dom';

interface RichTextLinkProps {
  disabled: boolean;
}

type FormData = {
  hyperlink: string;
  title: string;
};

const RichTextLink = ({ disabled }: RichTextLinkProps) => {
  const editor = useSlate();
  const [openViewer, setOpenViewer] = React.useState(false);
  const formRef = React.useRef<FormRef<FormProps>>(null);

  const handleSubmit = (link: FormData) => {
    const { selection } = editor;
    if (!selection) return;

    const isCollapsed = Range.isCollapsed(selection);
    if (isCollapsed) {
      Transforms.insertNodes(editor, {
        type: 'link',
        link,
        children: [{ text: link.title || link.hyperlink }],
      });
      Transforms.move(editor, { distance: 1, unit: 'offset' });
      Transforms.insertText(editor, ' ');
    } else {
      Transforms.wrapNodes(
        editor,
        {
          type: 'link',
          link,
          children: [],
        },
        { split: true, at: selection },
      );
      Transforms.collapse(editor, { edge: 'end' });
      Transforms.insertText(editor, ' ');
    }

    formRef.current?.reset();
    setOpenViewer(false);
  };

  return (
    <Popper
      placement="bottom"
      disabled={disabled}
      open={openViewer}
      onClickOutside={() => setOpenViewer(false)}
      content={
        <Form
          onSubmit={handleSubmit}
          rules={{
            hyperlink: ['url', 'required'],
          }}
          className="bg-neutral-10 p-2 rounded shadow-md z-50 flex flex-col gap-2 w-64"
          formRef={formRef}
        >
          <TextField id="hyperlink" placeholder="Enter Link URL" autoFocus />
          <TextField id="title" placeholder="Enter Link Title" />
          <div className="flex justify-end">
            <Button type="submit" size="small">
              Insert Link
            </Button>
          </div>
        </Form>
      }
    >
      <button
        type="button"
        title="Add Link"
        onClick={() => setOpenViewer(true)}
        disabled={disabled}
        className={cx(
          'shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-neutral-10 dark:bg-neutral-10-dark disabled:bg-neutral-20 dark:disabled:bg-neutral-20-dark disabled:cursor-not-allowed',
          {
            'hover:border border-neutral-40 ': !disabled,
          },
        )}
      >
        <Icon name="link" size={20} />
      </button>
    </Popper>
  );
};

export default RichTextLink;
