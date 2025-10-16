export interface AccordionItem {
  key: string | number;
  title: React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  collapsible?: 'icon' | 'header';
  singleCollapse?: boolean;
  defaultActiveKey?: Array<string | number>;
  activeKey?: Array<string | number>;
  onChangeActiveKey?: (key: Array<string | number>) => void;
  size?: 'default' | 'large';
  className?: string;
}
