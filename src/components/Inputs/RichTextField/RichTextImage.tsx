import React from 'react';
import Icon from '../../Icon';
import RichTextToolbarButton from './RichTextToolbarButton';
import { useSlate } from 'slate-react';
import { Transforms } from 'slate';
import { CustomElement } from '.';

interface RichTextImageProps {
  disabled: boolean;
}

const RichTextImage = ({ disabled }: RichTextImageProps) => {
  const editor = useSlate();

  const InsertImageFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = () => {
      const files = input.files;
      if (files && files.length > 0) {
        for (const file of Array.from(files)) {
          const reader = new FileReader();
          reader.onload = () => {
            const url = reader.result as string;
            const img = new Image();
            img.onload = () => {
              const width = img.naturalWidth;
              const height = img.naturalHeight;

              Transforms.insertNodes(editor, {
                type: 'image',
                image: {
                  url,
                  title: file.name,
                  hyperlink: null,
                  width:
                    height > 200 ? Math.ceil((200 / height) * width) : width,
                  height: height > 200 ? 200 : height,
                  originalWidth: width,
                  originalHeight: height,
                },
                children: [{ text: '' }],
              } as CustomElement);

              Transforms.insertNodes(editor, {
                type: 'paragraph',
                children: [{ text: '' }],
              } as CustomElement);
            };
            img.src = url;
          };
          reader.readAsDataURL(file);
        }
      }
    };
    input.click();
  };

  return (
    <RichTextToolbarButton onClick={InsertImageFromFile} disabled={disabled}>
      <Icon name="photo" size={20} />
    </RichTextToolbarButton>
  );
};

export default RichTextImage;
