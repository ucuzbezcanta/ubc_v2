// components/AccordionItem.tsx
'use client'; // Bu dosyanın bir Client Component olduğunu belirtir

import React, { useState } from 'react';

interface AccordionItemProps {
  id: string;
  title: string;
  content: string;
  isActive?: boolean; // Başlangıçta aktif olup olmadığını belirtmek için
}

const AccordionItem: React.FC<AccordionItemProps> = ({ id, title, content, isActive = false }) => {
  const [isOpen, setIsOpen] = useState(isActive);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-200 dark:border-neutral-700">
      <button
        className="group py-4 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
        aria-expanded={isOpen}
        aria-controls={id}
        onClick={toggleAccordion}
      >
        {title}
        <svg
          className={`shrink-0 size-5 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        id={id}
        className={`overflow-hidden transition-[height] duration-300 ease-in-out ${
          isOpen ? 'h-auto pb-4' : 'h-0'
        }`}
        role="region"
        aria-labelledby={`heading-${id}`} // Her bir başlık için benzersiz id
      >
        <p className="text-gray-600 dark:text-neutral-400">
          {content}
        </p>
      </div>
    </div>
  );
};

export default AccordionItem;