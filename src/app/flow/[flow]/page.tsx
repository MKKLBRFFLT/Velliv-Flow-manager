'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import LeftNavBar from '../../../components/navbar';
import NumericQuestion from '../../../components/NumericQuestion';
import TextQuestion from '../../../components/TextQuestion';

type Question = {
  text: string;
  inputType: 'number' | 'text';
  min?: number;
  max?: number;
  lowOutcome?: string;
  highOutcome?: string;
  placeholder?: string;
};

type Flow = {
  id: string;
  name: string;
  description: string;
  questions: Question[];
};

export default function FlowEditor() {
  const params = useParams();
  const [flow, setFlow] = useState<Flow | null>(null);
  const [questionType, setQuestionType] = useState<'number' | 'text'>('number');
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [previewAnswers, setPreviewAnswers] = useState<Record<number, string | number>>({});

  useEffect(() => {
    const flowId = params.flow as string;
    const flows = JSON.parse(localStorage.getItem('flows') || '[]') as Flow[];
    const currentFlow = flows.find((f) => f.id === flowId) || null;
    setFlow(currentFlow);
  }, [params.flow]);

  const handleAddQuestion = (question: Question) => {
    if (!flow) return;

    const updatedFlow = {
      ...flow,
      questions: [...flow.questions, question],
    };

    const flows = JSON.parse(localStorage.getItem('flows') || '[]') as Flow[];
    const updatedFlows = flows.map((f) => (f.id === flow.id ? updatedFlow : f));
    localStorage.setItem('flows', JSON.stringify(updatedFlows));

    setFlow(updatedFlow);
  };

  const handleAnswerChange = (index: number, value: string | number) => {
    setPreviewAnswers((prev) => ({ ...prev, [index]: value }));
  };

  if (!flow) return <div>Loading...</div>;

  return (
    <div className="flex">
      <LeftNavBar onQuestionTypeChange={setQuestionType} />
      <div className="ml-48 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">{isPreview ? `Preview: ${flow.name}` : `Editing Flow: ${flow.name}`}</h1>
        <p className="text-gray-600 mb-6">{flow.description}</p>

        {!isPreview ? (
          <>
            {questionType === 'number' ? (
              <NumericQuestion onAddQuestion={handleAddQuestion} />
            ) : (
              <TextQuestion onAddQuestion={handleAddQuestion} />
            )}
            <h2 className="text-xl font-semibold mt-6">Questions</h2>
            <ul className="space-y-4">
              {flow.questions.map((q, index) => (
                <li key={index} className="border p-4 rounded shadow-sm bg-gray-50">
                  <p className="font-medium">{q.text}</p>
                  <p>Type: {q.inputType === 'number' ? 'Numeric Input' : 'Text Input'}</p>
                  {q.inputType === 'number' && (
                    <>
                      <p>Min: {q.min ?? 'None'}, Max: {q.max ?? 'None'}</p>
                      <p>Low Outcome: {q.lowOutcome ?? 'None'}, High Outcome: {q.highOutcome ?? 'None'}</p>
                    </>
                  )}
                  {q.inputType === 'text' && <p>Placeholder: {q.placeholder ?? 'None'}</p>}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Questions</h2>
            <ul className="space-y-4">
              {flow.questions.map((q, index) => (
                <li key={index} className="border p-4 rounded shadow-sm bg-gray-50">
                  <p className="font-medium">{q.text}</p>
                  {q.inputType === 'number' ? (
                    <div className="mt-2">
                      <input
                        type="number"
                        onChange={(e) => handleAnswerChange(index, Number(e.target.value))}
                        className="border p-2 rounded w-full"
                      />
                      {typeof previewAnswers[index] === 'number' && (
                        <>
                          {q.min !== undefined && previewAnswers[index] < q.min && (
                            <p className="text-red-500 mt-2">{q.lowOutcome}</p>
                          )}
                          {q.max !== undefined && previewAnswers[index] > q.max && (
                            <p className="text-red-500 mt-2">{q.highOutcome}</p>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder={q.placeholder ?? ''}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="border p-2 rounded w-full"
                    />
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-6 hover:bg-blue-600"
        >
          {isPreview ? 'Exit Preview Mode' : 'Enter Preview Mode'}
        </button>
      </div>
    </div>
  );
}
















