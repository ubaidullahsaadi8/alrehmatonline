'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SimpleDropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
}

export default function SimpleDropdown({ 
  trigger, 
  children, 
  align = 'right' 
}: SimpleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="inline-block cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </div>

      {isOpen && (
        <div 
          className={`absolute mt-2 ${align === 'right' ? 'right-0' : 'left-0'} z-50 min-w-[200px] rounded bg-[#191919] shadow-lg transform-none animate-in fade-in-0 zoom-in-95`}
          style={{ border: 'none', outline: 'none' , background:"#D4A017", }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
