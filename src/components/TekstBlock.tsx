'use client';

import { useState } from 'react';
import { Question } from "@/utils/types";

type TekstBlockProps = {
  onAddTekstBlock: (tekstBlock: Question) => void;
};

export default function TekstBlock({ onAddTekstBlock }: TekstBlockProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleAddTekstBlock = () => {
    if (!title.trim() || !body.trim()) return;
  
    const newTekstBlock: Question = {
      text: title.trim(), // Titel
      inputType: "tekst-block", // Type som string
      body: body.trim(), // Brødtekst
    };
  
    onAddTekstBlock(newTekstBlock); // Tilføj tekstblok
    setTitle('');
    setBody('');
  };
  

  return (
    <div className="border p-4 rounded shadow-sm bg-gray-50 space-y-4 max-w-sm">
      <h2 className="text-xl font-semibold">Tilføj tekstblok</h2>
      <input
        type="text"
        placeholder="Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <textarea
        placeholder="Brødtekst"
        value={body}
        onChange={(e) => setBody(e.target.value)}
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
