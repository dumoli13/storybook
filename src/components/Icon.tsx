import React from 'react';
import cx from 'classnames';
import icon from '../assets/icon.svg';

export type IconNames =
  | 'academic-cap'
  | 'activity'
  | 'adjustments-horizontal'
  | 'adjustments-vertical'
  | 'alert-circle'
  | 'alert-octagon'
  | 'alert-triangle'
  | 'anchor'
  | 'archive-box-arrow-down'
  | 'archive-box-x-mark'
  | 'archive-box'
  | 'arrow-down-circle'
  | 'arrow-down-left'
  | 'arrow-down-on-square-stack'
  | 'arrow-down-on-square'
  | 'arrow-down-right'
  | 'arrow-down-tray'
  | 'arrow-down'
  | 'arrow-left-circle'
  | 'arrow-left-end-on-rectangle'
  | 'arrow-left-start-on-rectangle'
  | 'arrow-left'
  | 'arrow-long-down'
  | 'arrow-long-left'
  | 'arrow-long-right'
  | 'arrow-long-up'
  | 'arrow-path-rounded-square'
  | 'arrow-path'
  | 'arrow-right-circle'
  | 'arrow-right-end-on-rectangle'
  | 'arrow-right-start-on-rectangle'
  | 'arrow-right'
  | 'arrow-top-right-on-square'
  | 'arrow-trending-down'
  | 'arrow-trending-up'
  | 'arrow-turn-down-left'
  | 'arrow-turn-down-right'
  | 'arrow-turn-left-down'
  | 'arrow-turn-left-up'
  | 'arrow-turn-right-down'
  | 'arrow-turn-right-up'
  | 'arrow-turn-up-left'
  | 'arrow-turn-up-right'
  | 'arrow-up-circle'
  | 'arrow-up-left'
  | 'arrow-up-on-square-stack'
  | 'arrow-up-on-square'
  | 'arrow-up-right'
  | 'arrow-up-tray'
  | 'arrow-up'
  | 'arrow-uturn-down'
  | 'arrow-uturn-left'
  | 'arrow-uturn-right'
  | 'arrow-uturn-up'
  | 'arrows-pointing-in'
  | 'arrows-pointing-out'
  | 'arrows-right-left'
  | 'arrows-up-down'
  | 'at-symbol'
  | 'backspace'
  | 'backward'
  | 'banknotes'
  | 'bars-2'
  | 'bars-3-bottom-left'
  | 'bars-3-bottom-right'
  | 'bars-3-center-left'
  | 'bars-3'
  | 'bars-4'
  | 'bars-arrow-down'
  | 'bars-arrow-up'
  | 'battery-0'
  | 'battery-100'
  | 'battery-50'
  | 'beaker'
  | 'bell-alert'
  | 'bell-slash'
  | 'bell-snooze'
  | 'bell'
  | 'bold'
  | 'bolt-slash'
  | 'bolt'
  | 'book-open'
  | 'bookmark-slash'
  | 'bookmark-square'
  | 'bookmark'
  | 'briefcase'
  | 'bug-ant'
  | 'building-library'
  | 'building-office-2'
  | 'building-office'
  | 'building-storefront'
  | 'cake'
  | 'calculator'
  | 'calendar-date-range'
  | 'calendar-days'
  | 'calendar'
  | 'camera'
  | 'chart-bar-square'
  | 'chart-bar'
  | 'chart-pie'
  | 'chat-bubble-bottom-center-text'
  | 'chat-bubble-bottom-center'
  | 'chat-bubble-left-ellipsis'
  | 'chat-bubble-left-right'
  | 'chat-bubble-left'
  | 'chat-bubble-oval-left-ellipsis'
  | 'chat-bubble-oval-left'
  | 'check-badge'
  | 'check-circle'
  | 'check'
  | 'chevron-double-down'
  | 'chevron-double-left'
  | 'chevron-double-right'
  | 'chevron-double-up'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up-down'
  | 'chevron-up'
  | 'circle-stack'
  | 'clipboard-document-check'
  | 'clipboard-document-list'
  | 'clipboard-document'
  | 'clipboard'
  | 'clock'
  | 'cloud-arrow-down'
  | 'cloud-arrow-up'
  | 'cloud'
  | 'code-bracket-square'
  | 'code-bracket'
  | 'cog-6-tooth'
  | 'cog-8-tooth'
  | 'cog'
  | 'command-line'
  | 'computer-desktop'
  | 'cpu-chip'
  | 'credit-card'
  | 'cube-transparent'
  | 'cube'
  | 'currency-dollar'
  | 'cursor-arrow-rays'
  | 'cursor-arrow-ripple'
  | 'device-phone-mobile'
  | 'device-tablet'
  | 'divide'
  | 'document-arrow-down'
  | 'document-arrow-up'
  | 'document-chart-bar'
  | 'document-check'
  | 'document-currency-dollar'
  | 'document-duplicate'
  | 'document-magnifying-glass'
  | 'document-minus'
  | 'document-plus'
  | 'document-text'
  | 'document'
  | 'ellipsis-horizontal-circle'
  | 'ellipsis-horizontal'
  | 'ellipsis-vertical'
  | 'envelope-open'
  | 'envelope'
  | 'equals'
  | 'exclamation-circle'
  | 'exclamation-triangle'
  | 'eye-dropper'
  | 'eye-slash'
  | 'eye'
  | 'face-frown'
  | 'face-smile'
  | 'film'
  | 'finger-print'
  | 'fire'
  | 'flag'
  | 'folder-arrow-down'
  | 'folder-minus'
  | 'folder-open'
  | 'folder-plus'
  | 'folder'
  | 'forward'
  | 'funnel'
  | 'gif'
  | 'gift-top'
  | 'gift'
  | 'globe-alt'
  | 'globe-americas'
  | 'globe-asia-australia'
  | 'globe-europe-africa'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'hand-raised'
  | 'hand-thumb-down'
  | 'hand-thumb-up'
  | 'hashtag'
  | 'heart'
  | 'help-circle'
  | 'home-modern'
  | 'home'
  | 'identification'
  | 'image'
  | 'inbox-arrow-down'
  | 'inbox-stack'
  | 'inbox'
  | 'information-circle'
  | 'italic'
  | 'key'
  | 'language'
  | 'lifebuoy'
  | 'light-bulb'
  | 'link-slash'
  | 'link'
  | 'list-bullet'
  | 'loader'
  | 'lock-closed'
  | 'lock-open'
  | 'magnifying-glass-circle'
  | 'magnifying-glass-minus'
  | 'magnifying-glass-plus'
  | 'magnifying-glass'
  | 'map-pin'
  | 'map'
  | 'maximize'
  | 'maximize2'
  | 'megaphone'
  | 'microphone'
  | 'minimize'
  | 'minimize2'
  | 'minus-circle'
  | 'minus'
  | 'moon'
  | 'musical-note'
  | 'newspaper'
  | 'no-symbol'
  | 'numbered-list'
  | 'paint-brush'
  | 'paper-airplane'
  | 'paper-clip'
  | 'pause-circle'
  | 'pause'
  | 'pencil-square'
  | 'pencil'
  | 'percent-badge'
  | 'phone-arrow-down-left'
  | 'phone-arrow-up-right'
  | 'phone-x-mark'
  | 'phone'
  | 'photo'
  | 'play-circle'
  | 'play-pause'
  | 'play'
  | 'plus-circle'
  | 'plus'
  | 'power'
  | 'presentation-chart-bar'
  | 'presentation-chart-line'
  | 'printer'
  | 'puzzle-piece'
  | 'qr-code'
  | 'question-mark-circle'
  | 'queue-list'
  | 'radio'
  | 'receipt-percent'
  | 'receipt-refund'
  | 'rectangle-group'
  | 'rectangle-stack'
  | 'rocket-launch'
  | 'rss'
  | 'scale'
  | 'scissors'
  | 'server-stack'
  | 'server'
  | 'share'
  | 'shield-check'
  | 'shield-exclamation'
  | 'shopping-bag'
  | 'shopping-cart'
  | 'signal-slash'
  | 'signal'
  | 'slash'
  | 'sparkles'
  | 'speaker-wave'
  | 'speaker-x-mark'
  | 'square-2-stack'
  | 'square-3-stack-3d'
  | 'squares-2x2'
  | 'squares-plus'
  | 'star'
  | 'stop-circle'
  | 'stop'
  | 'strikethrough'
  | 'sun'
  | 'swatch'
  | 'table-cells'
  | 'tag'
  | 'ticket'
  | 'trash'
  | 'trophy'
  | 'truck'
  | 'tv'
  | 'underline'
  | 'user-circle'
  | 'user-group'
  | 'user-minus'
  | 'user-plus'
  | 'user'
  | 'users'
  | 'variable'
  | 'video-camera-slash'
  | 'video-camera'
  | 'view-columns'
  | 'viewfinder-circle'
  | 'wallet'
  | 'wifi'
  | 'window'
  | 'wrench-screwdriver'
  | 'wrench'
  | 'x-circle'
  | 'x-mark';

export interface IconProps {
  name: IconNames;
  color?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  disabled?: boolean;
  animation?: 'spin' | 'pulse' | 'bounce' | 'ping';
}

/**
 * ready-to-use icons from the MisDesign icon library
 */
const Icon = React.forwardRef<HTMLSpanElement, IconProps>((props, ref) => {
  const {
    name,
    color = 'currentColor',
    size = '1em',
    strokeWidth = 1,
    className,
    onClick,
    disabled = false,
    animation,
  } = props;

  const animationStyle = React.useMemo(() => {
    const baseStyle: React.CSSProperties = {
      display: 'inline-block',
      verticalAlign: 'middle',
    };

    switch (animation) {
      case 'spin':
        return { ...baseStyle, animation: 'spin 1s linear infinite' };
      case 'pulse':
        return {
          ...baseStyle,
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        };
      case 'bounce':
        return { ...baseStyle, animation: 'bounce 1s infinite' };
      case 'ping':
        return {
          ...baseStyle,
          animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        };
      default:
        return baseStyle;
    }
  }, [animation]);

  return (
    <span
      ref={ref}
      aria-label={name}
      className={cx(
        'flex items-center justify-center',
        className,
        {
          'cursor-pointer': !!onClick && !disabled,
        },
      )}
      {...(onClick && !disabled && { onClick, role: 'button', tabIndex: 0 })}
    >
      <svg
        viewBox="0 0 24 24" // Maintain aspect ratio
        width={size}
        height={size}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={animationStyle}
      >
        <use xlinkHref={`${icon}#${name}`} />
      </svg>

      {/* Add global keyframes */}
      <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .5; }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
            50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
          }
          @keyframes ping {
            75%, 100% { transform: scale(2); opacity: 0; }
          }
        `}</style>
    </span>
  );
});
Icon.displayName = 'Icon';

export default Icon;
