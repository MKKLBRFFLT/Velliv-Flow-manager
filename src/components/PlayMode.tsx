'use client';

import React, { useState } from 'react';

type Question = {
  text: string;
  inputType: string;
  answers?: string[]; // For multiple-choice questions
  allowMultipleAnswers?: boolean; // For allowing multiple selections
};

type PreCondition = {
  questionIndex: number;
  expectedValue: string | number | string[];
};

type PostCondition = {
  condition: { questionIndex: number; value: string | number | string[] };
  nextPageId: string;
};

type Page = {
  id: string;
  name: string;
  questions: Question[];
  preConditions?: PreCondition[];
  postConditions?: PostCondition[];
};

type Flow = {
  pages: Page[];
};

type PlayModeProps = {
  flow: Flow;
  onExit: () => void; // Callback to exit play mode
};

export default function PlayMode({ flow, onExit }: PlayModeProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number | string[]>>({});
  const [isEnd, setIsEnd] = useState(false);

  const currentPage = flow.pages[currentPageIndex];

  // Handle answering a question
  const handleAnswerChange = (index: number, value: string | number | string[]) => {
    setAnswers((prev) => ({ ...prev, [currentPageIndex * 100 + index]: value }));
  };

  // Navigate to the next page based on post-conditions
  const handleNextPage = () => {
    const currentAnswers = answers;

    // Check post-conditions
    const matchedPostCondition = currentPage.postConditions?.find((condition) => {
      const answer = currentAnswers[currentPageIndex * 100 + condition.condition.questionIndex];
      return answer === condition.condition.value;
    });

    if (matchedPostCondition) {
      const nextPageIndex = flow.pages.findIndex((page) => page.id === matchedPostCondition.nextPageId);
      if (nextPageIndex !== -1) {
        setCurrentPageIndex(nextPageIndex);
        return;
      }
    }

    // End the flow if no conditions match
    setIsEnd(true);
  };

  // Check if all pre-conditions are met
  const canEnterPage = (page: Page): boolean => {
    return (
      page.preConditions?.every((condition) => {
        const answer = answers[currentPageIndex * 100 + condition.questionIndex];
        return answer === condition.expectedValue;
      }) ?? true
    );
  };

  if (isEnd) {
    // End page: Show all answers
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Flow er afsluttet</h2>
        <h3 className="text-lg font-semibold mb-2">Du har svaret:</h3>
        <ul className="list-disc ml-6">
          {flow.pages.map((page, pageIndex) => (
            <li key={pageIndex} className="mb-4">
              <strong>{page.name}</strong>
              <ul className="list-disc ml-6">
                {page.questions.map((q, questionIndex) => (
                  <li key={questionIndex}>
                    {q.text}: {answers[pageIndex * 100 + questionIndex] || 'No answer'}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <button
          onClick={onExit}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
        >
          Exit Play Mode
        </button>
      </div>
    );
  }

  if (!canEnterPage(currentPage)) {
    // Redirect to end if conditions for the current page aren't met
    setIsEnd(true);
    return null;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{currentPage.name}</h2>
      <ul className="space-y-4">
        {currentPage.questions.map((q, index) => (
          <li key={index} className="border p-4 rounded shadow-sm bg-gray-50">
            <p className="font-medium">{q.text}</p>
            {q.inputType === 'number' ? (
              <input
                type="number"
                value={answers[currentPageIndex * 100 + index] || ''}
                onChange={(e) => handleAnswerChange(index, Number(e.target.value))}
                className="border p-2 rounded w-full"
              />
            ) : q.inputType === 'multiple-choice' && q.answers ? (
              <div>
                {q.answers.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    onClick={() => {
                      if (q.allowMultipleAnswers) {
                        const currentAnswers = Array.isArray(answers[currentPageIndex * 100 + index])
                          ? (answers[currentPageIndex * 100 + index] as string[])
                          : [];
                        const newAnswers = currentAnswers.includes(option)
                          ? currentAnswers.filter((a) => a !== option)
                          : [...currentAnswers, option];
                        handleAnswerChange(index, newAnswers);
                      } else {
                        handleAnswerChange(index, option);
                      }
                    }}
                    className={`border p-2 rounded w-full text-left mb-2 ${
                      (Array.isArray(answers[currentPageIndex * 100 + index]) &&
                        (answers[currentPageIndex * 100 + index] as string[]).includes(option)) ||
                      answers[currentPageIndex * 100 + index] === option
                        ? 'bg-blue-100'
                        : ''
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={answers[currentPageIndex * 100 + index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="border p-2 rounded w-full"
              />
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={handleNextPage}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
      >
        Next
      </button>
    </div>
  );
}


