'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LeftNavBar from "../../../components/navbar";
import NumericQuestion from "../../../components/NumericQuestion";
import TextQuestion from "../../../components/TextQuestion";
import MultipleChoiceQuestion from "../../../components/MultipleChoiceQuestion";
import CheckboxQuestion from "../../../components/CheckboxQuestion";
import CalendarQuestion from "../../../components/CalendarQuestion";
import DropdownQuestion from "../../../components/DropdownQuestion";

type Question = {
  text: string;
  inputType: "number" | "text" | "multiple-choice" | "checkbox" | "calendar" | "dropdown";
  min?: number;
  max?: number;
  lowOutcome?: string;
  highOutcome?: string;
  placeholder?: string;
  answers?: string[];
  allowMultipleAnswers?: boolean;
  options?: string[];
};

type Page = {
  id: string;
  name: string;
  questions: Question[];
};

type Flow = {
  id: string;
  name: string;
  description: string;
  pages: Page[];
};

export default function FlowEditor() {
  const params = useParams();
  const [flow, setFlow] = useState<Flow | null>(null);
  const [questionType, setQuestionType] = useState<
  'number' | 'text' | 'multiple-choice' | 'checkbox' | 'calendar' | 'dropdown'
>('number');
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [previewAnswers, setPreviewAnswers] = useState<
    Record<number, string | number | string[]>
  >({});
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  useEffect(() => {
    const flowId = params.flow as string;
    const flows = JSON.parse(localStorage.getItem("flows") || "[]") as Flow[];
    const currentFlow = flows.find((f) => f.id === flowId) || null;

    if (currentFlow) {
      if (!currentFlow.pages) {
        currentFlow.pages = [];
        const updatedFlows = flows.map((f) =>
          f.id === currentFlow.id ? currentFlow : f
        );
        localStorage.setItem("flows", JSON.stringify(updatedFlows));
      }
    }

    setFlow(currentFlow);
  }, [params.flow]);

  const handleAddPage = () => {
    if (!flow) return;

    const newPageId = `page${flow.pages.length + 1}`;
    const newPage: Page = {
      id: newPageId,
      name: `Side ${flow.pages.length + 1}`,
      questions: [],
    };

    const updatedFlow: Flow = {
      ...flow,
      pages: [...flow.pages, newPage],
    };

    // Update flows in local storage
    const flows = JSON.parse(localStorage.getItem("flows") || "[]") as Flow[];
    const updatedFlows = flows.map((f) => (f.id === flow.id ? updatedFlow : f));
    localStorage.setItem("flows", JSON.stringify(updatedFlows));

    setFlow(updatedFlow);
    setCurrentPageIndex(updatedFlow.pages.length - 1);
  };

  const handleAddQuestion = (question: Question) => {
    if (!flow) return;

    const updatedPages = flow.pages.map((page, index) => {
      if (index === currentPageIndex) {
        return {
          ...page,
          questions: [...page.questions, question],
        };
      }
      return page;
    });

    const updatedFlow: Flow = {
      ...flow,
      pages: updatedPages,
    };

    const flows = JSON.parse(localStorage.getItem("flows") || "[]") as Flow[];
    const updatedFlows = flows.map((f) => (f.id === flow.id ? updatedFlow : f));
    localStorage.setItem("flows", JSON.stringify(updatedFlows));

    setFlow(updatedFlow);
  };

  const handleAnswerChange = (index: number, value: string | number | string[]) => {
    setPreviewAnswers((prev) => ({ ...prev, [index]: value }));
  };

  if ((flow?.pages?.length ?? 0) < 1) {
    handleAddPage();
  }

  if (!flow) return <div>Loading...</div>;

  return (
    <div className="flex">
      <LeftNavBar onQuestionTypeChange={setQuestionType} flowName={flow.name} />
      <div className="ml-48 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">
          {isPreview ? `Preview: ${flow.name}` : `Editing Flow: ${flow.name}`}
        </h1>
        <p className="text-gray-600 mb-6">{flow.description}</p>

        {/* Page Navigation */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setCurrentPageIndex(0)}
            disabled={currentPageIndex === 0}
            className={`px-3 py-1 rounded ${
              currentPageIndex === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Første side
          </button>

          <button
            onClick={() => setCurrentPageIndex(currentPageIndex - 1)}
            disabled={currentPageIndex === 0}
            className={`px-3 py-1 rounded ${
              currentPageIndex === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Forrige side
          </button>

          <span className="px-3 py-1 rounded bg-blue-500 text-white">
            Side {currentPageIndex + 1} of {flow.pages.length}
          </span>

          <button
            onClick={() => setCurrentPageIndex(currentPageIndex + 1)}
            disabled={currentPageIndex === flow.pages.length - 1}
            className={`px-3 py-1 rounded ${
              currentPageIndex === flow.pages.length - 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Næste side
          </button>

          <button
            onClick={() => setCurrentPageIndex(flow.pages.length - 1)}
            disabled={currentPageIndex === flow.pages.length - 1}
            className={`px-3 py-1 rounded ${
              currentPageIndex === flow.pages.length - 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Sidste side
          </button>

          <button
            type="button"
            onClick={handleAddPage}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Tilføj ny side
          </button>
        </div>

        {!isPreview ? (
          <>
          {questionType === "number" ? (
        <NumericQuestion onAddQuestion={handleAddQuestion} />
      ) : questionType === "text" ? (
        <TextQuestion onAddQuestion={handleAddQuestion} />
      ) : questionType === "multiple-choice" ? (
        <MultipleChoiceQuestion onAddQuestion={handleAddQuestion} />
      ) : questionType === "checkbox" ? (
        <CheckboxQuestion onAddQuestion={handleAddQuestion} />
      ) : questionType === "calendar" ? (
        <CalendarQuestion onAddQuestion={handleAddQuestion} />
      ) : questionType === "dropdown" ? (
        <DropdownQuestion onAddQuestion={handleAddQuestion} />
            ) : null
            }
            <h2 className="text-xl font-semibold mt-6">
              Spørgsmål på side {flow.pages[currentPageIndex]?.name}
            </h2>
            <ul className="space-y-4">
              {flow.pages[currentPageIndex]?.questions.map((q, index) => (
                <li
  key={index}
  className="border p-4 rounded shadow-sm bg-gray-50"
>
  <p className="font-medium">{q.text}</p>
  <p>Type: {q.inputType}</p>

  {/* handling for number input */}
  {q.inputType === "number" && (
    <>
      <p>
        Min: {q.min ?? "None"}, Max: {q.max ?? "None"}
      </p>
      <p>
        Low Outcome: {q.lowOutcome ?? "None"}, High Outcome:{" "}
        {q.highOutcome ?? "None"}
      </p>
    </>
  )}

  {/* handling for text input */}
  {q.inputType === "text" && (
    <p>Placeholder: {q.placeholder ?? "None"}</p>
  )}

  {/* handling for multiple-choice */}
  {q.inputType === "multiple-choice" && (
    <ul className="space-y-2">
      
      {q.answers?.map((answer, answerIndex) => (
        <li key={answerIndex} className="border p-2 rounded">
          {answer}
        </li>
      ))}
      <p>
        Allow Multiple Answers:{" "}
        {q.allowMultipleAnswers ? "Yes" : "No"}
      </p>
    </ul>
  )}

  {/* handling for checkbox input */}
  {q.inputType === "checkbox" && (
    <>
      <p>Options:</p>
      <ul className="space-y-2">
        {q.options?.map((option, optionIndex) => (
          <li key={optionIndex} className="border p-2 rounded">
            {option}
          </li>
        ))}
      </ul>
    </>
  )}

  {/* handling for dropdown input */}
  {q.inputType === "dropdown" && (
    <>
      <p>Options:</p>
      <ul className="space-y-2">
        {q.options?.map((option, optionIndex) => (
          <li key={optionIndex} className="border p-2 rounded">
            {option}
          </li>
        ))}
      </ul>
    </>
  )}

  {/* handling for calendar input */}
  {q.inputType === "calendar" && (
    <p>This is a calendar question.</p>

  )}
</li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Spørgsmål {flow.pages[currentPageIndex]?.name}
            </h2>
            <ul className="space-y-4">
              {flow.pages[currentPageIndex]?.questions.map((q, index) => (
                <li
                key={index}
                className="border p-4 rounded shadow-sm bg-gray-50"
              >
                <p className="font-medium">{q.text}</p>
              
                {q.inputType === "number" ? (
                  // handling for number input
                  <div className="mt-2">
                    <input
                      type="number"
                      onChange={(e) =>
                        handleAnswerChange(index, Number(e.target.value))
                      }
                      className="border p-2 rounded w-full"
                    />
                    {/* validation message */}
                  </div>
                ) : q.inputType === "text" ? (
                  // handling for text input
                  <input
                    type="text"
                    placeholder={q.placeholder ?? ""}
                    onChange={(e) =>
                      handleAnswerChange(index, e.target.value)
                    }
                    className="border p-2 rounded w-full"
                  />
                ) : q.inputType === "multiple-choice" ? (
                  // handling for multiple-choice
                  <div className="mt-2">
                  {q.answers?.map((answer, answerIndex) => (
                    <button
                      key={answerIndex}
                      onClick={() => {
                        if (q.allowMultipleAnswers) {
                          const currentAnswers = Array.isArray(
                            previewAnswers[index]
                          )
                            ? (previewAnswers[index] as string[])
                            : [];
                          const newAnswers = currentAnswers.includes(
                            answer
                          )
                            ? currentAnswers.filter((a) => a !== answer)
                            : [...currentAnswers, answer];
                          handleAnswerChange(index, newAnswers);
                        } else {
                          handleAnswerChange(index, answer);
                        }
                      }}
                      className={`border p-2 rounded w-full text-left ${
                        (Array.isArray(previewAnswers[index]) &&
                          previewAnswers[index].includes(answer)) ||
                        previewAnswers[index] === answer
                          ? "bg-blue-100"
                          : ""
                      }`}
                    >
                      {answer}
                    </button>
                  ))}
                </div>
                ) : q.inputType === "checkbox" ? (
                  // handling for checkbox input
                  <div className="mt-2">
                    {q.options?.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center">
                        <input
                          type="checkbox"
                          value={option}
                          onChange={(e) => {
                            const selectedOptions = Array.isArray(previewAnswers[index])
                              ? (previewAnswers[index] as string[])
                              : [];
                            if (e.target.checked) {
                              handleAnswerChange(index, [...selectedOptions, option]);
                            } else {
                              handleAnswerChange(
                                index,
                                selectedOptions.filter((opt) => opt !== option)
                              );
                            }
                          }}
                        />
                        <span className="ml-2">{option}</span>
                      </label>
                    ))}
                  </div>
                ) : q.inputType === "dropdown" ? (
                  // handling for dropdown input
                  <div className="mt-2">
                    <select
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="border p-2 rounded w-full"
                    >
                      <option value="">Select an option</option>
                      {q.options?.map((option, optionIndex) => (
                        <option key={optionIndex} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : q.inputType === "calendar" ? (
                  // handling for calendar input
                  <div className="mt-2">
                    <input
                      type="date"
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="border p-2 rounded w-full"
                    />
                  </div>
                ) : null}
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
          {isPreview ? "Exit Preview Mode" : "Enter Preview Mode"}
        </button>
      </div>
    </div>
  );
}

