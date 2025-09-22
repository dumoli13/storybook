import React from 'react';
import { Editor, Element } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import RichTextImageViewer from './RichTextImageViewer';
import { RichTextRenderElementProps, CustomElement } from '.';
import cx from 'classnames';
import RichTextLinkViewer from './RichTextLinkViewer';

const classNameMap = {
  'heading-one': 'text-30px font-bold',
  'heading-two': 'text-24px font-semibold',
  'heading-three': 'text-20px font-semibold',
  'heading-four': 'text-18px font-medium',
  'heading-five': 'text-16px font-medium',
  'heading-six': 'text-14px font-medium',
};

const RichTextElement = (props: RichTextRenderElementProps) => {
  const { attributes, children, element } = props;
  const editor = useSlate();
  const style: React.CSSProperties = {};

  if ('color' in element && element.color) style.color = element.color;
  if ('align' in element && element.align) style.textAlign = element.align;

  switch (element.type) {
    case 'heading-one':
      return (
        <h1
          {...attributes}
          className={classNameMap['heading-one']}
          style={style}
        >
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2
          {...attributes}
          className={classNameMap['heading-two']}
          style={style}
        >
          {children}
        </h2>
      );
    case 'heading-three':
      return (
        <h3
          {...attributes}
          className={classNameMap['heading-three']}
          style={style}
        >
          {children}
        </h3>
      );
    case 'heading-four':
      return (
        <h4
          {...attributes}
          className={classNameMap['heading-four']}
          style={style}
        >
          {children}
        </h4>
      );
    case 'heading-five':
      return (
        <h5
          {...attributes}
          className={classNameMap['heading-five']}
          style={style}
        >
          {children}
        </h5>
      );
    case 'heading-six':
      return (
        <h6
          {...attributes}
          className={classNameMap['heading-six']}
          style={style}
        >
          {children}
        </h6>
      );
    case 'paragraph': {
      const hasListChild = element.children.some(
        (child: any) =>
          child.type === 'bulleted-list' || child.type === 'numbered-list',
      );

      if (hasListChild) {
        return (
          <div {...attributes} style={style}>
            {children}
          </div>
        );
      }

      const parent = Editor.above(editor, {
        at: ReactEditor.findPath(editor, element),
        match: (element: CustomElement) =>
          Element.isElement(element) && element.type === 'list-item',
      });

      if (parent) {
        return (
          <span {...attributes} style={style}>
            {children}
          </span>
        );
      }

      return (
        <p {...attributes} style={style}>
          {children}
        </p>
      );
    }
    case 'block-quote':
      return (
        <blockquote
          {...attributes}
          className="border-l-4 pl-3 italic"
          style={style}
        >
          {children}
        </blockquote>
      );
    case 'bulleted-list':
    case 'numbered-list': {
      const Tag = element.type === 'bulleted-list' ? 'ul' : 'ol';

      if (!element.children || element.children.length === 0) {
        return <>{children}</>;
      }
      return (
        <Tag
          {...attributes}
          className={cx('mb-2 text-left', {
            'list-disc': element.type === 'bulleted-list',
            'list-decimal': element.type === 'numbered-list',
          })}
          style={{
            textAlign: element.align,
            listStylePosition: 'inside',
          }}
        >
          {children}
        </Tag>
      );
    }
    case 'list-item': {
      const parent = Editor.above(editor, {
        at: ReactEditor.findPath(editor, element),
        match: (element: CustomElement) =>
          Element.isElement(element) &&
          (element.type === 'bulleted-list' ||
            element.type === 'numbered-list'),
      });

      if (!parent) {
        return (
          <p
            {...attributes}
            className="mb-2 text-left"
            style={{ textAlign: element.align }}
          >
            {children}
          </p>
        );
      }

      const headingType = (element as any).heading;

      return (
        <li
          {...attributes}
          className={cx('text-left', classNameMap[headingType])}
          style={{ textAlign: element.align || 'left' }}
        >
          {children}
        </li>
      );
    }
    case 'link': {
      return <RichTextLinkViewer {...props} />;

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
    }
    case 'image':
      return <RichTextImageViewer {...props} />;
    case 'table':
      return (
        <div {...attributes} className="my-4 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <tbody>{children}</tbody>
          </table>
        </div>
      );
    case 'table-row':
      return (
        <tr
          {...attributes}
          className={
            element.isHeader
              ? 'bg-neutral-80 dark:bg-neutral-80-dark font-semibold'
              : ''
          }
        >
          {children}
        </tr>
      );
    case 'table-cell':
      return (
        <td
          {...attributes}
          className="border border-gray-300 p-2 align-top"
          colSpan={element.colspan}
          rowSpan={element.rowspan}
        >
          {children}
        </td>
      );
    default:
      return (
        <p {...attributes} style={style}>
          {children}
        </p>
      );
  }
};

export default RichTextElement;
