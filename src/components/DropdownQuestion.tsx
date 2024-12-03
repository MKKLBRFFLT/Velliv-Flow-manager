'use client';

import { useState } from 'react';

type DropdownQuestionProps = {
  onAddQuestion: (question: any) => void;
};

export default function DropdownQuestion({ onAddQuestion }: DropdownQuestionProps) {
  const [text, setText] = useState('');
  const [options, setOptions] = useState<string[]>(['']);

  const handleAddQuestion = () => {
    if (!text) return;

    const newQuestion = {
      text,
      inputType: 'dropdown',
      options,
    };

    onAddQuestion(newQuestion);
    setText('');
    setOptions(['']);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, '']);

  return (
    <div>
      <h2>Add Dropdown Question</h2>
      <input
        type="text"
        placeholder="Question text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 rounded w-full"
      />
      {options.map((option, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
          className="border p-2 rounded w-full mt-2"
        />
      ))}
      <button onClick={addOption} className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600">
        Add Option
      </button>
      <button onClick={handleAddQuestion} className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600">
        Add Question
      </button>
    </div>
  );
}
