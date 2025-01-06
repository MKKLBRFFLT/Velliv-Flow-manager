'use client';

import { useState } from 'react';
import { Question } from '@/utils/types';

type TekstBlockProps = {
  onAddTekstBlock: (tekstBlock: Question) => void;
};

export default function TekstBlock({ onAddTekstBlock }: TekstBlockProps) {
  const [text, setText] = useState('');

  const handleAddTekstBlock = () => {
    if (!text.trim()) return;

    const newTekstBlock: Question = {
      text: text.trim(),
      inputType: "tekst-block",
    };

    onAddTekstBlock(newTekstBlock);
    setText('');
  };

  return (
    <div className="border p-4 rounded shadow-sm bg-gray-50 space-y-4 max-w-sm">
      <h2 className="text-xl font-semibold">Tilføj tekstblok</h2>
      <textarea
        placeholder="Indtast informationstekst"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handleAddTekstBlock}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Tilføj tekstblok
      </button>
    </div>
  );
}