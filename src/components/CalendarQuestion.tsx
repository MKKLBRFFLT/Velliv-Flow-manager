'use client';

import { useState } from 'react';

type CalendarQuestionProps = {
  onAddQuestion: (question: any) => void;
};

export default function CalendarQuestion({ onAddQuestion }: CalendarQuestionProps) {
  const [text, setText] = useState('');

  const handleAddQuestion = () => {
    if (!text) return;

    const newQuestion = {
      text,
      inputType: 'calendar',
    };

    onAddQuestion(newQuestion);
    setText('');
  };

  return (
    <div>
      <h2>Add Calendar Question</h2>
      <input
        type="text"
        placeholder="Question text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button onClick={handleAddQuestion} className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600">
        Add Question
      </button>
    </div>
  );
}