'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Question = {
  text: string;
  inputType: 'number';
  min?: number;
  max?: number;
  lowOutcome?: string;
  highOutcome?: string;
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
  const [newQuestion, setNewQuestion] = useState<Question>({
    text: '',
    inputType: 'number',
  });
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [previewAnswers, setPreviewAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    const flowId = params.flow as string;
    const flows = JSON.parse(localStorage.getItem('flows') || '[]') as Flow[];
    const currentFlow = flows.find((f) => f.id === flowId) || null;
    setFlow(currentFlow);
  }, [params.flow]);

  const handleAddQuestion = () => {
    if (!flow || !newQuestion.text) return;

    const updatedFlow = {
      ...flow,
      questions: [...flow.questions, newQuestion],
    };

    const flows = JSON.parse(localStorage.getItem('flows') || '[]') as Flow[];
    const updatedFlows = flows.map((f) => (f.id === flow.id ? updatedFlow : f));
    localStorage.setItem('flows', JSON.stringify(updatedFlows));

    setFlow(updatedFlow);
    setNewQuestion({ text: '', inputType: 'number' });
  };

  const handleAnswerChange = (index: number, value: number) => {
    setPreviewAnswers((prev) => ({ ...prev, [index]: value }));
  };

  if (!flow) return <div>Loading...</div>;

  return (
    <div className="ml-48 p-6">
      <h1 className="text-2xl font-bold mb-4">{isPreview ? `Preview: ${flow.name}` : `Editing Flow: ${flow.name}`}</h1>
      <p className="text-gray-600 mb-6">{flow.description}</p>

      {!isPreview && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Add New Question</h2>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Question text"
              value={newQuestion.text}
              onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              placeholder="Min value (optional)"
              value={newQuestion.min ?? ''}
              onChange={(e) => setNewQuestion({ ...newQuestion, min: e.target.value ? Number(e.target.value) : undefined })}
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              placeholder="Max value (optional)"
              value={newQuestion.max ?? ''}
              onChange={(e) => setNewQuestion({ ...newQuestion, max: e.target.value ? Number(e.target.value) : undefined })}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Low outcome message"
              value={newQuestion.lowOutcome ?? ''}
              onChange={(e) => setNewQuestion({ ...newQuestion, lowOutcome: e.target.value })}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="High outcome message"
              value={newQuestion.highOutcome ?? ''}
              onChange={(e) => setNewQuestion({ ...newQuestion, highOutcome: e.target.value })}
              className="border p-2 rounded w-full"
            />
            <button
              type="button"
              onClick={handleAddQuestion}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
            >
              Add Question
            </button>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Questions</h2>
      <ul className="space-y-4">
        {flow.questions.map((q, index) => (
          <li
            key={index}
            className="border p-4 rounded shadow-sm bg-gray-50"
          >
            <p className="font-medium">{q.text}</p>
            {isPreview ? (
              <div className="mt-2">
                <input
                  type="number"
                  onChange={(e) => handleAnswerChange(index, Number(e.target.value))}
                  className="border p-2 rounded w-full"
                />
                {previewAnswers[index] !== undefined && (
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
              <div className="mt-2">
                <p>Min: {q.min ?? 'None'}, Max: {q.max ?? 'None'}</p>
                <p>Low Outcome: {q.lowOutcome ?? 'None'}, High Outcome: {q.highOutcome ?? 'None'}</p>
              </div>
            )}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setIsPreview(!isPreview)}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-6 hover:bg-blue-600"
      >
        {isPreview ? 'Exit Preview Mode' : 'Enter Preview Mode'}
      </button>
    </div>
  );
}




