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

  // Handle changes to answers
  const handleAnswerChange = (index: number, value: string | number | string[]) => {
    setAnswers((prev) => ({ ...prev, [currentPageIndex * 100 + index]: value }));
  };

  // Navigate to the next page
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

    // End the flow if no matching post-condition is found
    setIsEnd(true);
  };

  // Navigate to the previous page
  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Check if the current page can be accessed (all pre-conditions met)
  const canEnterPage = (page: Page): boolean => {
    return (
      page.preConditions?.every((condition) => {
        const answer = answers[currentPageIndex * 100 + condition.questionIndex];
        return answer === condition.expectedValue;
      }) ?? true
    );
  };

  if (isEnd) {
    // End page displaying answers
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Flow Completed</h2>
          <h3 className="text-lg font-semibold mb-2">Your Answers:</h3>
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
      </div>
    );
  }

  if (!canEnterPage(currentPage)) {
    // Redirect to end if conditions for the current page aren't met
    setIsEnd(true);
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">{currentPage.name}</h2>
        <ul className="space-y-4">
          {currentPage.questions.map((q, index) => (
            <li key={index} className="border p-4 rounded shadow-sm bg-gray-50">
              <p className="font-medium mb-2">{q.text}</p>
              {q.inputType === 'number' ? (
                <input
                  type="number"
                  value={answers[currentPageIndex * 100 + index] || ''}
                  onChange={(e) => handleAnswerChange(index, Number(e.target.value))}
                  className="border p-2 rounded w-full"
                />
              ) : q.inputType === 'multiple-choice' && q.answers ? (
                <div className="flex flex-col space-y-2">
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
                      className={`p-2 rounded border w-full ${
                        (Array.isArray(answers[currentPageIndex * 100 + index]) &&
                          (answers[currentPageIndex * 100 + index] as string[]).includes(option)) ||
                        answers[currentPageIndex * 100 + index] === option
                          ? 'bg-blue-100 border-blue-500'
                          : 'hover:bg-gray-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : q.inputType === 'calendar' ? (
                <input
                  type="date"
                  value={answers[currentPageIndex * 100 + index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="border p-2 rounded w-full"
                />
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
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPageIndex === 0}
            className={`bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 ${
              currentPageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Back
          </button>
          <button
            onClick={handleNextPage}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}