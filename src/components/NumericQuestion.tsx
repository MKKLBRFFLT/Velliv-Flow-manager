'use client';

import { useState } from 'react';

type NumericQuestionProps = {
  onAddQuestion: (question: any) => void;
};

export default function NumericQuestion({ onAddQuestion }: NumericQuestionProps) {
  const [text, setText] = useState('');
  const [min, setMin] = useState<number | undefined>();
  const [max, setMax] = useState<number | undefined>();
  const [lowOutcome, setLowOutcome] = useState('');
  const [highOutcome, setHighOutcome] = useState('');

  const handleAddQuestion = () => {
    if (!text) return;

    const newQuestion = {
      text,
      inputType: 'number',
      min,
      max,
      lowOutcome,
      highOutcome,
    };

    onAddQuestion(newQuestion);
    setText('');
    setMin(undefined);
    setMax(undefined);
    setLowOutcome('');
    setHighOutcome('');
  };

  return (
    <div>
      <h2>Add Numeric Question</h2>
      <input
        type="text"
        placeholder="Question text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="number"
        placeholder="Min value (optional)"
        value={min ?? ''}
        onChange={(e) => setMin(e.target.value ? Number(e.target.value) : undefined)}
        className="border p-2 rounded w-full"
      />
      <input
        type="number"
        placeholder="Max value (optional)"
        value={max ?? ''}
        onChange={(e) => setMax(e.target.value ? Number(e.target.value) : undefined)}
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Low outcome message"
        value={lowOutcome}
        onChange={(e) => setLowOutcome(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="High outcome message"
        value={highOutcome}
        onChange={(e) => setHighOutcome(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button onClick={handleAddQuestion} className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600">
        Add Question
      </button>
    </div>
  );
}




