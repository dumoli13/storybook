import React from 'react'
import type { Meta, StoryObj } from '@storybook/react';
import { IconProps, Icon, IconNames, TextField, Tag, Tab } from '../../src/components';
import '../../src/output.css';
import { fn } from '@storybook/test';

const meta: Meta<IconProps> = {
    title: 'Icon',
    component: Icon,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'radio',
            options: ['outline', 'solid'],
            description: 'The variant of the icon.',
            table: {
                type: { summary: 'outline | solid' },
            },
        },
        name: {
            control: 'select',
            description: 'The name of the icon.',
            table: {
                type: { summary: 'IconNames' },
            },
        },
        color: {
            control: 'color',
            description: 'The stroke color of the icon.',
            table: {
                type: { summary: 'string' },
            },
        },
        fillColor: {
            control: 'color',
            description: 'The fill color of the icon. Only applicable to solid variant.',
            table: {
                type: { summary: 'string' },
            },
        },
        size: {
            control: 'number',
            description: 'The size of the icon.',
            table: {
                type: { summary: 'number' },
            },
        },
        strokeWidth: {
            control: 'number',
            description: 'The stroke width of the icon.',
            table: {
                type: { summary: 'number' },
            },
        },
        className: {
            control: false,
            description: 'Additional class names to customize the component style.',
            table: {
                type: { summary: 'string' }
            }
        },
        onClick: {
            control: false,
            description: 'Callback when the icon is clicked',
            table: {
                type: { summary: '() => void' },
            },
        },
        disabled: {
            control: 'boolean',
            description: 'A flag to disable the icon.',
            table: {
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        animation: {
            control: 'select',
            options: ['spin', 'pulse', 'bounce', 'ping'],
            description: 'The animation of the icon.',
            table: {
                type: { summary: 'spin | pulse | bounce | ping' },
            },
        },
    },
};

export default meta;
type Story = StoryObj<IconProps>;


const iconNames: { name: IconNames, tags: string }[] = [
    { name: 'academic-cap', tags: 'academic cap academic-cap' },
    { name: 'activity', tags: 'activity pulse' },
    { name: 'adjustments-horizontal', tags: 'tune adjustments horizontal adjustments-horizontal' },
    { name: 'adjustments-vertical', tags: 'tune adjustments vertical adjustments-vertical' },
    { name: 'alert-circle', tags: 'alert circle alert-circle' },
    { name: 'alert-octagon', tags: 'alert octagon alert-octagon' },
    { name: 'alert-triangle', tags: 'alert triangle alert-triangle' },
    { name: 'anchor', tags: 'anchor' },
    { name: 'archive-box-arrow-down', tags: 'archive box arrow down archive-box-arrow-down' },
    { name: 'archive-box-x-mark', tags: 'archive box x mark archive-box-x-mark' },
    { name: 'archive-box', tags: 'archive box archive-box' },
    { name: 'arrow-down-circle', tags: 'arrow down circle arrow-down-circle' },
    { name: 'arrow-down-left', tags: 'arrow down left arrow-down-left' },
    { name: 'arrow-down-on-square-stack', tags: 'arrow down on square stack arrow-down-on-square-stack' },
    { name: 'arrow-down-on-square', tags: 'arrow down on square arrow-down-on-square' },
    { name: 'arrow-down-right', tags: 'arrow down right arrow-down-right' },
    { name: 'arrow-down-tray', tags: 'arrow down tray arrow-down-tray' },
    { name: 'arrow-down', tags: 'arrow down arrow-down' },
    { name: 'arrow-left-circle', tags: 'arrow left circle arrow-left-circle' },
    { name: 'arrow-left-end-on-rectangle', tags: 'in arrow left end on rectangle arrow-left-end-on-rectangle' },
    { name: 'arrow-left-start-on-rectangle', tags: 'out arrow left start on rectangle arrow-left-start-on-rectangle' },
    { name: 'arrow-left', tags: 'arrow left arrow-left' },
    { name: 'arrow-long-down', tags: 'arrow long down arrow-long-down' },
    { name: 'arrow-long-left', tags: 'arrow long left arrow-long-left' },
    { name: 'arrow-long-right', tags: 'arrow long right arrow-long-right' },
    { name: 'arrow-long-up', tags: 'arrow long up arrow-long-up' },
    { name: 'arrow-path-rounded-square', tags: 'repeat circle recycle arrow path rounded square arrow-path-rounded-square' },
    { name: 'arrow-path', tags: 'refresh circle recycle arrow path arrow-path' },
    { name: 'arrow-right-circle', tags: 'arrow right circle arrow-right-circle' },
    { name: 'arrow-right-end-on-rectangle', tags: 'in aarrow right end on rectangle arrow-right-end-on-rectangle' },
    { name: 'arrow-right-start-on-rectangle', tags: 'out arrow right start on rectangle arrow-right-start-on-rectangle' },
    { name: 'arrow-right', tags: 'arrow right arrow-right' },
    { name: 'arrow-top-right-on-square', tags: 'arrow top right on square arrow-top-right-on-square' },
    { name: 'arrow-trending-down', tags: 'arrow trending down arrow-trending-down' },
    { name: 'arrow-trending-up', tags: 'arrow trending up arrow-trending-up' },
    { name: 'arrow-turn-down-left', tags: 'arrow turn down left arrow-turn-down-left' },
    { name: 'arrow-turn-down-right', tags: 'arrow turn down right arrow-turn-down-right' },
    { name: 'arrow-turn-left-down', tags: 'arrow turn left down arrow-turn-left-down' },
    { name: 'arrow-turn-left-up', tags: 'arrow turn left up arrow-turn-left-up' },
    { name: 'arrow-turn-right-down', tags: 'arrow turn right down arrow-turn-right-down' },
    { name: 'arrow-turn-right-up', tags: 'arrow turn right up arrow-turn-right-up' },
    { name: 'arrow-turn-up-left', tags: 'arrow turn up left arrow-turn-up-left' },
    { name: 'arrow-turn-up-right', tags: 'arrow turn up right arrow-turn-up-right' },
    { name: 'arrow-up-circle', tags: 'arrow up circle arrow-up-circle' },
    { name: 'arrow-up-left', tags: 'arrow up left arrow-up-left' },
    { name: 'arrow-up-on-square-stack', tags: 'arrow up on square stack arrow-up-on-square-stack' },
    { name: 'arrow-up-on-square', tags: 'arrow up on square arrow-up-on-square' },
    { name: 'arrow-up-right', tags: 'arrow up right arrow-up-right' },
    { name: 'arrow-up-tray', tags: 'arrow up tray arrow-up-tray' },
    { name: 'arrow-up', tags: 'arrow up arrow-up' },
    { name: 'arrow-uturn-down', tags: 'arrow uturn down arrow-uturn-down' },
    { name: 'arrow-uturn-left', tags: 'arrow uturn left arrow-uturn-left' },
    { name: 'arrow-uturn-right', tags: 'arrow uturn right arrow-uturn-right' },
    { name: 'arrow-uturn-up', tags: 'arrow uturn up arrow-uturn-up' },
    { name: 'arrows-pointing-in', tags: 'arrows pointing in arrows-pointing-in' },
    { name: 'arrows-pointing-out', tags: 'arrows pointing out arrows-pointing-out' },
    { name: 'arrows-right-left', tags: 'arrows right left arrows-right-left' },
    { name: 'arrows-up-down', tags: 'arrows up down arrows-up-down' },
    { name: 'at-symbol', tags: 'at symbol at-symbol' },
    { name: 'backspace', tags: 'backspace backspace' },
    { name: 'backward', tags: 'backward backward' },
    { name: 'banknotes', tags: 'banknotes banknotes' },
    { name: 'bars-2', tags: 'bars 2 bars-2' },
    { name: 'bars-3-bottom-left', tags: 'align bars 3, bottom left bars-3-bottom-left' },
    { name: 'bars-3-bottom-right', tags: 'align bars 3 bottom right bars-3-bottom-right' },
    { name: 'bars-3-center-left', tags: 'align bars 3 center left bars-3-center-left' },
    { name: 'bars-3', tags: 'menu bars 3 bars-3' },
    { name: 'bars-4', tags: 'bars 4 bars-4' },
    { name: 'bars-arrow-down', tags: 'bars arrow down bars-arrow-down' },
    { name: 'bars-arrow-up', tags: 'bars arrow up bars-arrow-up' },
    { name: 'battery-0', tags: 'battery 0 battery-0' },
    { name: 'battery-100', tags: 'battery 100 battery-100' },
    { name: 'battery-50', tags: 'battery 50 battery-50' },
    { name: 'beaker', tags: 'beaker beaker' },
    { name: 'bell-alert', tags: 'bell alert bell-alert' },
    { name: 'bell-slash', tags: 'bell slash bell-slash' },
    { name: 'bell-snooze', tags: 'bell snooze bell-snooze' },
    { name: 'bell', tags: 'bell bell' },
    { name: 'bold', tags: 'bold bold' },
    { name: 'bolt-slash', tags: 'bolt slash bolt-slash' },
    { name: 'bolt', tags: 'bolt bolt' },
    { name: 'book-open', tags: 'book open book-open' },
    { name: 'bookmark-slash', tags: 'bookmark slash bookmark-slash' },
    { name: 'bookmark-square', tags: 'bookmark square bookmark-square' },
    { name: 'bookmark', tags: 'bookmark bookmark' },
    { name: 'briefcase', tags: 'briefcase briefcase' },
    { name: 'bug-ant', tags: 'bug ant bug-ant' },
    { name: 'building-library', tags: 'building library building-library' },
    { name: 'building-office-2', tags: 'building office 2 building-office-2' },
    { name: 'building-office', tags: 'building office building-office' },
    { name: 'building-storefront', tags: 'building storefront building-storefront' },
    { name: 'cake', tags: 'cake cake' },
    { name: 'calculator', tags: 'calculator calculator' },
    { name: 'calendar-date-range', tags: 'calendar date range calendar-date-range' },
    { name: 'calendar-days', tags: 'calendar days calendar-days' },
    { name: 'calendar', tags: 'calendar calendar' },
    { name: 'camera', tags: 'camera camera' },
    { name: 'chart-bar-square', tags: 'chart bar square chart-bar-square' },
    { name: 'chart-bar', tags: 'chart bar chart-bar' },
    { name: 'chart-pie', tags: 'chart pie chart-pie' },
    { name: 'chat-bubble-bottom-center-text', tags: 'chat bubble bottom center text chat-bubble-bottom-center-text' },
    { name: 'chat-bubble-bottom-center', tags: 'chat bubble bottom center chat-bubble-bottom-center' },
    { name: 'chat-bubble-left-ellipsis', tags: 'chat bubble left ellipsis chat-bubble-left-ellipsis' },
    { name: 'chat-bubble-left-right', tags: 'chat bubble left right chat-bubble-left-right' },
    { name: 'chat-bubble-left', tags: 'chat bubble left chat-bubble-left' },
    { name: 'chat-bubble-oval-left-ellipsis', tags: 'chat bubble oval left ellipsis chat-bubble-oval-left-ellipsis' },
    { name: 'chat-bubble-oval-left', tags: 'chat bubble oval left chat-bubble-oval-left' },
    { name: 'check-badge', tags: 'check badge check-badge' },
    { name: 'check-circle', tags: 'check circle check-circle' },
    { name: 'check', tags: 'check check' },
    { name: 'chevron-double-down', tags: 'chevron double down chevron-double-down' },
    { name: 'chevron-double-left', tags: 'chevron double left chevron-double-left' },
    { name: 'chevron-double-right', tags: 'chevron double right chevron-double-right' },
    { name: 'chevron-double-up', tags: 'chevron double up chevron-double-up' },
    { name: 'chevron-down', tags: 'chevron down chevron-down' },
    { name: 'chevron-left', tags: 'chevron left chevron-left' },
    { name: 'chevron-right', tags: 'chevron right chevron-right' },
    { name: 'chevron-up-down', tags: 'chevron up down chevron-up-down' },
    { name: 'chevron-up', tags: 'chevron up chevron-up' },
    { name: 'circle-stack', tags: 'circle stack circle-stack' },
    { name: 'clipboard-document-check', tags: 'clipboard document check clipboard-document-check' },
    { name: 'clipboard-document-list', tags: 'clipboard document list clipboard-document-list' },
    { name: 'clipboard-document', tags: 'clipboard document clipboard-document' },
    { name: 'clipboard', tags: 'clipboard clipboard' },
    { name: 'clock', tags: 'clock clock' },
    { name: 'cloud-arrow-down', tags: 'cloud arrow down cloud-arrow-down' },
    { name: 'cloud-arrow-up', tags: 'cloud arrow up cloud-arrow-up' },
    { name: 'cloud', tags: 'cloud cloud' },
    { name: 'code-bracket-square', tags: 'code bracket square code-bracket-square' },
    { name: 'code-bracket', tags: 'code bracket code-bracket' },
    { name: 'cog-6-tooth', tags: 'cog 6 tooth cog-6-tooth' },
    { name: 'cog-8-tooth', tags: 'cog 8 tooth cog-8-tooth' },
    { name: 'cog', tags: 'cog cog' },
    { name: 'command-line', tags: 'command line command-line' },
    { name: 'computer-desktop', tags: 'computer desktop computer-desktop' },
    { name: 'cpu-chip', tags: 'cpu chip cpu-chip' },
    { name: 'credit-card', tags: 'credit card credit-card' },
    { name: 'cube-transparent', tags: 'cube transparent cube-transparent' },
    { name: 'cube', tags: 'cube cube' },
    { name: 'currency-dollar', tags: 'currency dollar currency-dollar' },
    { name: 'cursor-arrow-rays', tags: 'cursor arrow rays cursor-arrow-rays' },
    { name: 'cursor-arrow-ripple', tags: 'cursor arrow ripple cursor-arrow-ripple' },
    { name: 'device-phone-mobile', tags: 'device phone mobile device-phone-mobile' },
    { name: 'device-tablet', tags: 'device tablet device-tablet' },
    { name: 'divide', tags: 'divide divide' },
    { name: 'document-arrow-down', tags: 'document arrow down document-arrow-down' },
    { name: 'document-arrow-up', tags: 'document arrow up document-arrow-up' },
    { name: 'document-chart-bar', tags: 'document chart bar document-chart-bar' },
    { name: 'document-check', tags: 'document check document-check' },
    { name: 'document-currency-dollar', tags: 'document currency dollar document-currency-dollar' },
    { name: 'document-duplicate', tags: 'document duplicate document-duplicate' },
    { name: 'document-magnifying-glass', tags: 'document magnifying glass document-magnifying-glass' },
    { name: 'document-minus', tags: 'document minus document-minus' },
    { name: 'document-plus', tags: 'document plus document-plus' },
    { name: 'document-text', tags: 'document text document-text' },
    { name: 'document', tags: 'document document' },
    { name: 'ellipsis-horizontal-circle', tags: 'ellipsis horizontal circle ellipsis-horizontal-circle' },
    { name: 'ellipsis-horizontal', tags: 'ellipsis horizontal ellipsis-horizontal' },
    { name: 'ellipsis-vertical', tags: 'ellipsis vertical ellipsis-vertical' },
    { name: 'envelope-open', tags: 'envelope open envelope-open' },
    { name: 'envelope', tags: 'envelope envelope' },
    { name: 'equals', tags: 'equals equals' },
    { name: 'exclamation-circle', tags: 'exclamation circle exclamation-circle' },
    { name: 'exclamation-triangle', tags: 'exclamation triangle exclamation-triangle' },
    { name: 'eye-dropper', tags: 'eye dropper eye-dropper' },
    { name: 'eye-slash', tags: 'eye slash eye-slash' },
    { name: 'eye', tags: 'eye' },
    { name: 'face-frown', tags: 'face frown face-frown' },
    { name: 'face-smile', tags: 'face smile face-smile' },
    { name: 'film', tags: 'film' },
    { name: 'finger-print', tags: 'finger print finger-print' },
    { name: 'fire', tags: 'fire' },
    { name: 'flag', tags: 'flag' },
    { name: 'folder-arrow-down', tags: 'folder arrow down folder-arrow-down' },
    { name: 'folder-minus', tags: 'folder minus folder-minus' },
    { name: 'folder-open', tags: 'folder open folder-open' },
    { name: 'folder-plus', tags: 'folder plus folder-plus' },
    { name: 'folder', tags: 'folder' },
    { name: 'forward', tags: 'forward forward' },
    { name: 'funnel', tags: 'funnel funnel' },
    { name: 'gif', tags: 'gif gif' },
    { name: 'gift-top', tags: 'gift top gift-top' },
    { name: 'gift', tags: 'gift gift' },
    { name: 'globe-alt', tags: 'globe alt globe-alt' },
    { name: 'globe-americas', tags: 'globe americas globe-americas' },
    { name: 'globe-asia-australia', tags: 'globe asia australia globe-asia-australia' },
    { name: 'globe-europe-africa', tags: 'globe europe africa globe-europe-africa' },
    { name: 'h1', tags: 'h1' },
    { name: 'h2', tags: 'h2' },
    { name: 'h3', tags: 'h3' },
    { name: 'hand-raised', tags: 'hand raised hand-raised' },
    { name: 'hand-thumb-down', tags: 'hand thumb down hand-thumb-down' },
    { name: 'hand-thumb-up', tags: 'hand thumb up hand-thumb-up' },
    { name: 'hashtag', tags: 'hashtag hashtag' },
    { name: 'heart', tags: 'heart heart' },
    { name: 'help-circle', tags: 'help circle help-circle' },
    { name: 'home-modern', tags: 'home modern home-modern' },
    { name: 'home', tags: 'home' },
    { name: 'identification', tags: 'identification identification' },
    { name: 'image', tags: 'image' },
    { name: 'inbox-arrow-down', tags: 'inbox arrow down inbox-arrow-down' },
    { name: 'inbox-stack', tags: 'inbox stack inbox-stack' },
    { name: 'inbox', tags: 'inbox' },
    { name: 'information-circle', tags: 'information circle information-circle' },
    { name: 'italic', tags: 'italic italic' },
    { name: 'key', tags: 'key' },
    { name: 'language', tags: 'language language' },
    { name: 'lifebuoy', tags: 'lifebuoy lifebuoy' },
    { name: 'light-bulb', tags: 'light bulb light-bulb' },
    { name: 'link-slash', tags: 'unlink link slash link-slash' },
    { name: 'link', tags: 'link' },
    { name: 'list-bullet', tags: 'list bullet list-bullet' },
    { name: 'loader', tags: 'loader' },
    { name: 'lock-closed', tags: 'lock closed lock-closed' },
    { name: 'lock-open', tags: 'lock open lock-open' },
    { name: 'magnifying-glass-circle', tags: 'zoom out zoom-out magnifying glass circle magnifying-glass-circle' },
    { name: 'magnifying-glass-minus', tags: 'zoom in zoom-in magnifying glass minus magnifying-glass-minus' },
    { name: 'magnifying-glass-plus', tags: 'zoom magnifying glass plus magnifying-glass-plus' },
    { name: 'magnifying-glass', tags: 'magnifying glass magnifying-glass' },
    { name: 'map-pin', tags: 'map pin map-pin' },
    { name: 'map', tags: 'map' },
    { name: 'maximize', tags: 'maximize maximize' },
    { name: 'maximize2', tags: 'maximize 2 maximize2' },
    { name: 'megaphone', tags: 'megaphone megaphone' },
    { name: 'microphone', tags: 'microphone microphone' },
    { name: 'minimize', tags: 'minimize minimize' },
    { name: 'minimize2', tags: 'minimize 2 minimize2' },
    { name: 'minus-circle', tags: 'minus circle minus-circle' },
    { name: 'minus', tags: 'minus' },
    { name: 'moon', tags: 'moon' },
    { name: 'musical-note', tags: 'musical note musical-note' },
    { name: 'newspaper', tags: 'newspaper' },
    { name: 'no-symbol', tags: 'not allowed not-allowed no symbol no-symbol' },
    { name: 'numbered-list', tags: 'numbered list numbered-list' },
    { name: 'paint-brush', tags: 'paint brush paint-brush' },
    { name: 'paper-airplane', tags: 'send paper airplane paper-airplane' },
    { name: 'paper-clip', tags: 'paper clip paper-clip' },
    { name: 'pause-circle', tags: 'pause circle pause-circle' },
    { name: 'pause', tags: 'pause' },
    { name: 'pencil-square', tags: 'pencil square pencil-square' },
    { name: 'pencil', tags: 'pencil' },
    { name: 'percent-badge', tags: 'percent badge percent-badge' },
    { name: 'phone-arrow-down-left', tags: 'phone arrow down left phone-arrow-down-left' },
    { name: 'phone-arrow-up-right', tags: 'phone arrow up right phone-arrow-up-right' },
    { name: 'phone-x-mark', tags: 'phone x mark phone-x-mark' },
    { name: 'phone', tags: 'phone' },
    { name: 'photo', tags: 'photo' },
    { name: 'play-circle', tags: 'play circle play-circle' },
    { name: 'play-pause', tags: 'play pause play-pause' },
    { name: 'play', tags: 'play' },
    { name: 'plus-circle', tags: 'plus circle plus-circle' },
    { name: 'plus', tags: 'plus' },
    { name: 'power', tags: 'power' },
    { name: 'presentation-chart-bar', tags: 'presentation chart bar presentation-chart-bar' },
    { name: 'presentation-chart-line', tags: 'presentation chart line presentation-chart-line' },
    { name: 'printer', tags: 'printer' },
    { name: 'puzzle-piece', tags: 'puzzle piece puzzle-piece' },
    { name: 'qr-code', tags: 'qr code qr-code' },
    { name: 'question-mark-circle', tags: 'question mark circle question-mark-circle' },
    { name: 'queue-list', tags: 'queue list queue-list' },
    { name: 'radio', tags: 'radio' },
    { name: 'receipt-percent', tags: 'receipt percent receipt-percent' },
    { name: 'receipt-refund', tags: 'receipt refund receipt-refund' },
    { name: 'rectangle-group', tags: 'rectangle group rectangle-group' },
    { name: 'rectangle-stack', tags: 'rectangle stack rectangle-stack' },
    { name: 'rocket-launch', tags: 'rocket launch rocket-launch' },
    { name: 'rss', tags: 'rss' },
    { name: 'scale', tags: 'scale' },
    { name: 'scissors', tags: 'cut scissors' },
    { name: 'server-stack', tags: 'server stack server-stack' },
    { name: 'server', tags: 'server' },
    { name: 'share', tags: 'share' },
    { name: 'shield-check', tags: 'secure shield check shield-check' },
    { name: 'shield-exclamation', tags: 'secure shield exclamation shield-exclamation' },
    { name: 'shopping-bag', tags: 'cart shopping bag shopping-bag' },
    { name: 'shopping-cart', tags: 'shopping cart shopping-cart' },
    { name: 'signal-slash', tags: 'no-signal signal slash signal-slash' },
    { name: 'signal', tags: 'signal' },
    { name: 'slash', tags: 'slash' },
    { name: 'sparkles', tags: 'sparkles' },
    { name: 'speaker-wave', tags: 'speaker wave speaker-wave' },
    { name: 'speaker-x-mark', tags: 'speaker x mark speaker-x-mark' },
    { name: 'square-2-stack', tags: 'square 2 stack square-2-stack' },
    { name: 'square-3-stack-3d', tags: 'square 3 stack 3d square-3-stack-3d' },
    { name: 'squares-2x2', tags: 'squares 2x2 squares-2x2' },
    { name: 'squares-plus', tags: 'squares plus squares-plus' },
    { name: 'star', tags: 'star' },
    { name: 'stop-circle', tags: 'stop circle stop-circle' },
    { name: 'stop', tags: 'stop' },
    { name: 'strikethrough', tags: 'strikethrough' },
    { name: 'sun', tags: 'sun' },
    { name: 'swatch', tags: 'swatch' },
    { name: 'table-cells', tags: 'table cells table-cells' },
    { name: 'tag', tags: 'price price-tag tag' },
    { name: 'ticket', tags: 'ticket' },
    { name: 'trash', tags: 'bin trash' },
    { name: 'trophy', tags: 'trophy' },
    { name: 'truck', tags: 'truck' },
    { name: 'tv', tags: 'watch tv' },
    { name: 'underline', tags: 'underline' },
    { name: 'user-circle', tags: 'person user circle user-circle' },
    { name: 'user-group', tags: 'person users user group user-group' },
    { name: 'user-minus', tags: 'person user minus user-minus remove user-remove ' },
    { name: 'user-plus', tags: 'person user plus user-plus add user-add' },
    { name: 'user', tags: 'user' },
    { name: 'users', tags: 'users' },
    { name: 'variable', tags: 'variable' },
    { name: 'video-camera-slash', tags: 'no-video video camera slash video-camera-slash' },
    { name: 'video-camera', tags: 'video camera video-camera' },
    { name: 'view-columns', tags: 'view columns view-columns' },
    { name: 'viewfinder-circle', tags: 'viewfinder circle viewfinder-circle' },
    { name: 'wallet', tags: 'wallet' },
    { name: 'wifi', tags: 'signal wifi' },
    { name: 'window', tags: 'window' },
    { name: 'wrench-screwdriver', tags: 'wrench screwdriver wrench-screwdriver' },
    { name: 'wrench', tags: 'wrench' },
    { name: 'x-circle', tags: 'x circle x-circle close' },
    { name: 'x-mark', tags: 'x mark x-mark close' },
];


const IconCard = (props: IconProps) => {
    const { name, size, strokeWidth, disabled, color, animation } = props
    const [copied, setCopied] = React.useState(false);

    const handleClickIcon = () => {
        const iconProps = [
            `name="${name}"`,
            size ? `size={${size}}` : '',
            strokeWidth ? `strokeWidth="${strokeWidth}"` : '',
            disabled ? 'disabled' : '',
            color ? `color="${color}"` : '',
            animation ? `animation="${animation}"` : '',
        ]
            .filter(Boolean)
            .join(' ');

        const icon = `<Icon ${iconProps} />`;

        // ✅ Check for clipboard support first
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(icon).catch((err) => {
                console.warn('Clipboard writeText failed:', err);
                fallbackCopy(icon);
            });
        } else {
            fallbackCopy(icon);
        }

        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    // ✅ Fallback function
    const fallbackCopy = (text: string) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed'; // Avoid scrolling
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            document.execCommand('copy');
            console.log('Fallback: Copy succeeded');
        } catch (err) {
            console.error('Fallback: Copy failed', err);
        }

        document.body.removeChild(textarea);
    };


    return (
        <div
            className='flex flex-col justify-between gap-4 text-14px rounded-md p-4 shadow-box-1'
            role="button"
            onClick={handleClickIcon}
        >
            {copied ? (
                <span style={{ fontSize: '16px', textAlign: 'center', color: 'gray' }}>Copied...</span>
            ) : (
                <Icon {...props} />
            )}
            <span style={{ textAlign: 'center' }}>{props.name}</span>
        </div>

    )
}

export const Playground: Story = {
    args: {
        variant: 'solid',
        size: 24,
        strokeWidth: 0,
        onClick: fn(),
        disabled: false,
    },
    render: (args) => {
        const [query, setQuery] = React.useState('');
        const filteredIcons =
            query || args.name
                ? iconNames.filter((icon) =>
                    icon.tags.toLowerCase().includes((query ?? args.name).toLowerCase()),
                )
                : iconNames;

        return (
            <div
                className="flex flex-col gap-4 items-start justify-start bg-neutral-10 overflow-auto px-1"
                style={{
                    width: 921,
                    maxHeight: '800px',
                }}
            >
                <div className="flex flex-col sticky top-0 bg-neutral-10 w-full gap-4 p-1 z-10">
                    <Tag color='info'>Click to copy icon</Tag>
                    <TextField
                        placeholder="Search icons..."
                        value={query} onChange={setQuery}
                        fullWidth
                        size='large'
                    />
                </div>

                {filteredIcons.length > 0 ? (
                    <div className="p-1 grid grid-cols-6 gap-4" >
                        {filteredIcons.map((icon) => (
                            <IconCard key={icon.name} {...args} name={icon.name} />
                        ))}
                    </div>
                ) : (
                    <div
                        style={{
                            textAlign: 'center',
                            width: '100%',
                            padding: '16px',
                        }}
                    >
                        No icons found
                    </div>
                )}
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'Browse and search through all available icons with their names.',
            },
            source: {
                code: `
<Icon name="academic-cap" size={24} strokeWidth={1.5}/>
          `.trim(),
            },
        },
    },
};