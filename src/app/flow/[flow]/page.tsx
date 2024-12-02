"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LeftNavBar from "../../../components/navbar";
import NumericQuestion from "../../../components/NumericQuestion";
import TextQuestion from "../../../components/TextQuestion";

type Question = {
  text: string;
  inputType: "number" | "text";
  min?: number;
  max?: number;
  lowOutcome?: string;
  highOutcome?: string;
  placeholder?: string;
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
  questions: Question[];
  pages: Page[];
};

export default function FlowEditor() {
  const params = useParams();
  const [flow, setFlow] = useState<Flow | null>(null);
  const [questionType, setQuestionType] = useState<"number" | "text">("number");
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [previewAnswers, setPreviewAnswers] = useState<
    Record<number, string | number>
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

  const handleAnswerChange = (index: number, value: string | number) => {
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
            ) : (
              <TextQuestion onAddQuestion={handleAddQuestion} />
            )}
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
                  <p>
                    Type:{" "}
                    {q.inputType === "number" ? "Numeric Input" : "Text Input"}
                  </p>
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
                  {q.inputType === "text" && (
                    <p>Placeholder: {q.placeholder ?? "None"}</p>
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
                    <div className="mt-2">
                      <input
                        type="number"
                        onChange={(e) =>
                          handleAnswerChange(index, Number(e.target.value))
                        }
                        className="border p-2 rounded w-full"
                      />
                      {typeof previewAnswers[index] === "number" && (
                        <>
                          {q.min !== undefined &&
                            (previewAnswers[index] as number) < q.min && (
                              <p className="text-red-500 mt-2">
                                {q.lowOutcome}
                              </p>
                            )}
                          {q.max !== undefined &&
                            (previewAnswers[index] as number) > q.max && (
                              <p className="text-red-500 mt-2">
                                {q.highOutcome}
                              </p>
                            )}
                        </>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder={q.placeholder ?? ""}
                      onChange={(e) =>
                        handleAnswerChange(index, e.target.value)
                      }
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
          {isPreview ? "Exit Preview Mode" : "Enter Preview Mode"}
        </button>
      </div>
    </div>
  );
}
