'use client';

import { useState } from 'react';

type NumericQuestionProps = {
  onAddQuestion: (question: any) => void;
};

export default function NumericQuestion({ onAddQuestion }: NumericQuestionProps) {
  const [text, setText] = useState('');

  const handleAddQuestion = () => {
    if (!text) return;

    const newQuestion = {
      text,
      inputType: 'number', // The question type remains numeric
    };

    onAddQuestion(newQuestion);
    setText(''); // Reset the input field after adding the question
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Add Numeric Question</h2>
      <input
        type="text"
        placeholder="Indtast spørgsmålstekst"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      <button
        onClick={handleAddQuestion}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Tilføj spørgsmål
      </button>
    </div>
  );
}
