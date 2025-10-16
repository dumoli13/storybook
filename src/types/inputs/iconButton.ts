export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'secondary' | 'outlined' | 'text';
  color?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
  loading?: boolean;
  icon?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  size?: 'small' | 'default' | 'large';
  title: string;
  titleVerticalAlign?: 'top' | 'bottom';
  titleHorizontalAlign?: 'left' | 'center' | 'right';
}
