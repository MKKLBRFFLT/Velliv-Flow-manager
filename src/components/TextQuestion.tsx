'use client';

import { useState } from 'react';

type TextQuestionProps = {
  onAddQuestion: (question: any) => void;
};

export default function TextQuestion({ onAddQuestion }: TextQuestionProps) {
  const [text, setText] = useState('');
  const [placeholder, setPlaceholder] = useState('');

  const handleAddQuestion = () => {
    if (!text.trim()) return;

    const newQuestion = {
      text: text.trim(),
      inputType: 'text',
      placeholder: placeholder.trim() || undefined, // Optional placeholder
    };

    onAddQuestion(newQuestion);
    setText('');
    setPlaceholder('');
  };

  return (
    <div className="border p-4 rounded shadow-sm bg-gray-50 space-y-4">
      <h2 className="text-xl font-semibold">Tilføj tekstspørgsmål</h2>
      <input
        type="text"
        placeholder="Indtast spørgsmålstekst"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Pladsholdertekst (valgfrit)"
        value={placeholder}
        onChange={(e) => setPlaceholder(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handleAddQuestion}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Tilføj spørgsmål
      </button>
    </div>
  );
}
