import React from 'react';

interface ModalFooterProps {
  children: React.ReactNode;
}

const ModalFooter = ({ children }: ModalFooterProps) => {
  return (
    <div className="px-6 py-3 bg-neutral-20 dark:bg-neutral-30-dark flex justify-end items-center gap-3 rounded-b-md">
      {children}
    </div>
  );
};

export default ModalFooter;
