import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDebouncedCallback } from 'use-debounce';
import Icon from '../Icon';

interface ImageViewerProps {
  open: boolean;
  onClose: () => void;
  url: string | null;
}

/**
 * ImageViewer Component
 *
 * This component renders an image viewer that allows users to zoom in and out of an image and drag to reposition it within a modal. It provides controls to zoom in, zoom out, and view the image in its original size. The viewer is opened or closed based on the `open` prop.
 *
 * @interface ImageViewerProps
 * @property {boolean} open - A flag to determine if the image viewer should be displayed.
 * @property {() => void} onClose - A function to close the image viewer.
 * @property {string | null} url - The URL of the image to be displayed in the viewer.
 *
 * @example Basic Usage:
 * ```tsx
 * import ImageViewer from './ImageViewer';
 *
 * const MyComponent = () => {
 *   const [open, setOpen] = useState(false);
 *   const imageUrl = "/path/to/image.jpg";
 *
 *   return (
 *     <div>
 *       <button onClick={() => setOpen(true)}>Open Image Viewer</button>
 *       <ImageViewer open={open} onClose={() => setOpen(false)} url={imageUrl} />
 *     </div>
 *   );
 * };
 * ```
 *
 * @property {ImageViewerProps} props - The props for the ImageViewer component.
 * @returns {JSX.Element} An image viewer with zoom and drag functionality.
 */
const ImageViewer = ({ open, onClose, url }: ImageViewerProps) => {
  const [tempScale, setTempScale] = useState(100);
  const [scale, setScale] = useState(100);
  const viewerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragState = useRef<{
    isDragging: boolean;
    startX: number;
    startY: number;
  }>({
    isDragging: false,
    startX: 0,
    startY: 0,
  });

  // Calculate max drag boundaries based on image size and scale
  const getDragBoundaries = useCallback(() => {
    if (!imgRef.current || !containerRef.current) return { maxX: 0, maxY: 0 };

    const imgWidth = imgRef.current.naturalWidth * (scale / 100);
    const imgHeight = imgRef.current.naturalHeight * (scale / 100);
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    return {
      maxX: Math.max(0, (imgWidth - containerWidth) / 2),
      maxY: Math.max(0, (imgHeight - containerHeight) / 2),
    };
  }, [scale]);

  const handleZoom = useCallback((zoomIn: boolean) => {
    setScale((prev) => {
      const newScale = Math.max(
        50,
        Math.min(300, zoomIn ? prev + 10 : prev - 10),
      );
      setTempScale(newScale);

      // Reset position if zooming out to fit
      if (newScale <= 100) {
        setPosition({ x: 0, y: 0 });
      }

      return newScale;
    });
  }, []);

  const debounceApply = useDebouncedCallback(() => {
    if (tempScale < 50) {
      setScale(50);
      setTempScale(50);
    } else {
      setScale(tempScale);
    }
  }, 1000);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const decimalRegex = /^\d*\.?\d*$/;
    if (decimalRegex.test(inputValue)) {
      const newScale = Number(e.target.value);
      setTempScale(newScale);
      debounceApply();
    }
  };

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const zoomIn = e.deltaY < 0; // Scroll up to zoom in, scroll down to zoom out
      handleZoom(zoomIn);
    },
    [handleZoom],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow drag when zoomed
    if (scale <= 100) return;

    dragState.current = {
      isDragging: true,
      startX: e.clientX - position.x,
      startY: e.clientY - position.y,
    };
    document.body.style.cursor = 'grabbing';
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.current.isDragging) return;

      const boundaries = getDragBoundaries();
      const newX = e.clientX - dragState.current.startX;
      const newY = e.clientY - dragState.current.startY;

      setPosition({
        x: Math.max(-boundaries.maxX, Math.min(boundaries.maxX, newX)),
        y: Math.max(-boundaries.maxY, Math.min(boundaries.maxY, newY)),
      });
    },
    [getDragBoundaries],
  );

  const handleMouseUp = useCallback(() => {
    dragState.current.isDragging = false;
    document.body.style.cursor = '';
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const viewer = viewerRef.current;
      if (viewer) {
        viewer.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
          viewer?.removeEventListener('wheel', handleWheel);
        };
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  // Reset on close/open
  useEffect(() => {
    if (open) {
      setScale(100);
      setTempScale(100);
      setPosition({ x: 0, y: 0 });
    }
  }, [open]);

  // Event listeners
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [open, onClose, handleMouseMove, handleMouseUp]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-neutral-100/50">
      {/* Close button */}
      <button
        type="button"
        title="Close"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-8 right-8 z-50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-neutral-100/70 hover:bg-opacity-20"
      >
        <Icon
          name="x-mark"
          className="text-neutral-10"
          size={24}
          strokeWidth={2}
        />
      </button>

      {/* Image container */}
      <div
        ref={containerRef}
        className="relative h-full w-full overflow-hidden"
      >
        <div
          ref={viewerRef}
          className="flex h-full w-full items-center justify-center"
          onMouseDown={handleMouseDown}
        >
          {url && (
            <img
              ref={imgRef}
              src={url}
              alt="Zoomable content"
              className="max-h-[90vh] max-w-[90vw] object-contain"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${
                  scale / 100
                })`,
                transition: dragState.current.isDragging
                  ? 'none'
                  : 'transform 0.1s ease',
              }}
              draggable={false}
            />
          )}
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-full bg-neutral-100/70 px-10 py-4 text-lg text-neutral-10">
        <button
          type="button"
          title="zoom out"
          disabled={scale <= 50}
          onClick={() => handleZoom(false)}
          className="text-opacity-60 disabled:text-opacity-40"
        >
          <Icon name="minus-circle" size={24} strokeWidth={2} />
        </button>

        <div className="rounded-full bg-neutral-90 px-3 py-1">
          <input
            id="scale"
            value={tempScale}
            onChange={handleChange}
            className="w-10 bg-transparent text-center outline-none"
            aria-label="Scale percentage"
          />
          %
        </div>

        <button
          type="button"
          title="zoom in"
          disabled={scale >= 300}
          onClick={() => handleZoom(true)}
          className="disabled:opacity-40"
        >
          <Icon name="plus-circle" size={24} strokeWidth={2} />
        </button>
      </div>
    </div>,
    document.body,
  );
};

export default ImageViewer;
