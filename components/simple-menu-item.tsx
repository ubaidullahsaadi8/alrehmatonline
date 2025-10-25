'use client';

import React from 'react';

interface SimpleMenuItemProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function SimpleMenuItem({ onClick, children, className = '' }: SimpleMenuItemProps) {
  return (
    <div 
      className={`flex flex-row px-4 py-2.5 text-sm text-white hover:bg-[#2E7A4F] hover:text-[#fff] cursor-pointer ${className}`}
      onClick={onClick}
      role="menuitem"
      tabIndex={0}
      style={{ border: 'none', outline: 'none' }}
    >
      {children}
    </div>
  );
}

export function SimpleMenuDivider() {
  return <div className="h-px w-full bg-[#303030] my-1" style={{ border: 'none', outline: 'none' }} />;
}
