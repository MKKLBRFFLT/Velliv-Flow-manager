'use client';

import { useState } from 'react';

type TextQuestionProps = {
  onAddQuestion: (question: any) => void;
};

export default function TextQuestion({ onAddQuestion }: TextQuestionProps) {
  const [text, setText] = useState('');
  const [placeholder, setPlaceholder] = useState('');

  const handleAddQuestion = () => {
    if (!text) return;

    const newQuestion = {
      text,
      inputType: 'text',
      placeholder,
    };

    onAddQuestion(newQuestion);
    setText('');
    setPlaceholder('');
  };

  return (
    <div>
      <h2>Add Text Question</h2>
      <input
        type="text"
        placeholder="Question text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Placeholder text (optional)"
        value={placeholder}
        onChange={(e) => setPlaceholder(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button onClick={handleAddQuestion} className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600">
        Add Question
      </button>
    </div>
  );
}





