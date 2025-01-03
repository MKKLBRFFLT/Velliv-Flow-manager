'use client';

import { useState } from 'react';

type CalendarQuestionProps = {
  onAddQuestion: (question: any) => void;
};

export default function CalendarQuestion({ onAddQuestion }: CalendarQuestionProps) {
  const [text, setText] = useState('');

  const handleAddQuestion = () => {
    if (!text.trim()) return;

    const newQuestion = {
      text: text.trim(),
      inputType: 'calendar',
    };

    onAddQuestion(newQuestion);
    setText('');
  };

  return (
    <div className="border p-4 rounded shadow-sm bg-gray-50 space-y-4">
      <h2 className="text-xl font-semibold">Tilføj kalender spørgsmål</h2>
      <input
        type="text"
        placeholder="Indtast spørgsmålstekst"
        value={text}
        onChange={(e) => setText(e.target.value)}
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
