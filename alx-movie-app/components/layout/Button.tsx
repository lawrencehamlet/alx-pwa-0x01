import React from 'react';

export type LayoutButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

const LayoutButton: React.FC<LayoutButtonProps> = ({ label, children, ...props }) => {
  return (
    <button {...props}>
      {label ?? children}
    </button>
  );
};

export default LayoutButton;
