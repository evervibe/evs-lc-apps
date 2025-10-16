'use client';

import { useState } from 'react';

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

function AccordionItem({ question, answer, isOpen, onClick }: AccordionItemProps) {
  return (
    <div className="border border-foreground/10 rounded-lg overflow-hidden">
      <button
        onClick={onClick}
        className="w-full px-6 py-4 text-left bg-foreground/5 hover:bg-foreground/10 transition-all flex justify-between items-center"
      >
        <span className="font-semibold text-lg text-accent">{question}</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-background">
          <p className="text-foreground/70 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

interface AccordionProps {
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}
