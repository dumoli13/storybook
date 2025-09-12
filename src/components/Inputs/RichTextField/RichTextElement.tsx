import React from 'react';
import { Editor, Element, Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSlate } from "slate-react";


const RichTextElement = ({ attributes, children, element }: RenderElementProps) => {
    const editor = useSlate();
    const style: React.CSSProperties = {};

    if ('color' in element && element.color) style.color = element.color;
    if ('align' in element && element.align) style.textAlign = element.align;

    switch (element.type) {
        case 'heading-one':
            return (
                <h1 {...attributes} className="text-30px font-bold" style={style}>
                    {children}
                </h1>
            );
        case 'heading-two':
            return (
                <h2 {...attributes} className="text-24px font-semibold" style={style}>
                    {children}
                </h2>
            );
        case 'heading-three':
            return (
                <h3 {...attributes} className="text-20px font-semibold" style={style}>
                    {children}
                </h3>
            );
        case 'heading-four':
            return (
                <h4 {...attributes} className="text-18px font-medium" style={style}>
                    {children}
                </h4>
            );
        case 'heading-five':
            return (
                <h5 {...attributes} className="text-16px font-medium" style={style}>
                    {children}
                </h5>
            );
        case 'heading-six':
            return (
                <h6 {...attributes} className="text-14px font-medium" style={style}>
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
                match: (n) => Element.isElement(n) && n.type === 'list-item',
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
            const Tag: any = element.type === 'bulleted-list' ? 'ul' : 'ol';

            if (!element.children || element.children.length === 0) {
                return <>{children}</>;
            }
            return (
                <Tag
                    {...attributes}
                    style={{
                        textAlign: element.align || 'left',
                        listStyleType:
                            element.type === 'bulleted-list' ? 'disc' : 'decimal',
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
                match: (n) =>
                    Element.isElement(n) &&
                    (n.type === 'bulleted-list' || n.type === 'numbered-list'),
            });

            if (!parent) {
                return (
                    <p {...attributes} style={{ textAlign: element.align || 'left' }}>
                        {children}
                    </p>
                );
            }

            const headingType = (element as any).heading;
            const classNameMap: Record<string, string> = {
                'heading-one': 'text-30px font-bold',
                'heading-two': 'text-24px font-semibold',
                'heading-three': 'text-20px font-semibold',
                'heading-four': 'text-18px font-medium',
                'heading-five': 'text-16px font-medium',
                'heading-six': 'text-14px font-medium',
            };
            return (
                <li
                    {...attributes}
                    className={headingType ? classNameMap[headingType] : ''}
                    style={{ textAlign: element.align || 'left' }}
                >
                    {children}
                </li>
            );
        }
        case 'link':
            return (
                <a
                    {...attributes}
                    href={(element as any).url}
                    className="text-blue-600 underline cursor-pointer"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                        e.preventDefault();
                        window.open((element as any).url, '_blank');
                    }}
                >
                    {children}
                </a>
            );
        case 'image':
            return (
                <div
                    {...attributes}
                    contentEditable={false}
                    className="relative inline-block"
                >
                    <img
                        src={(element as any).url}
                        alt="pasted image"
                        className="max-w-[200px] max-h-[200px] object-contain rounded border"
                    />

                    <button
                        type="button"
                        onClick={() => {
                            const path = ReactEditor.findPath(editor, element);
                            Transforms.removeNodes(editor, { at: path });
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full"
                    >
                        ✕
                    </button>
                    {children}
                </div>
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