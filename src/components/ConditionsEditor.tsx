"use client";

import React, { useState } from "react";

type PreCondition = {
  questionIndex: number;
  expectedValue: string | number | string[];
};

type PostCondition = {
  condition: {
    questionIndex: number;
    value: string | number | string[];
  };
  nextPageId: string;
};

type Question = {
  text: string;
  inputType: string;
};

type Page = {
  id: string;
  name: string;
  questions: Question[];
  preConditions?: PreCondition[];
  postConditions?: PostCondition[];
};

type ConditionsEditorProps = {
  page: Page;
  allPages: Page[];
  onAddPreCondition: (preCondition: PreCondition) => void;
  onDeletePreCondition: (index: number) => void;
  onAddPostCondition: (postCondition: PostCondition) => void;
  onDeletePostCondition: (index: number) => void;
};

export default function ConditionsEditor({
  page,
  allPages,
  onAddPreCondition,
  onDeletePreCondition,
  onAddPostCondition,
  onDeletePostCondition,
}: ConditionsEditorProps) {
  const [preConditionPageId, setPreConditionPageId] = useState<string>("");
  const [preConditionQuestionIndex, setPreConditionQuestionIndex] =
    useState<number>(-1);
  const [preConditionExpectedValue, setPreConditionExpectedValue] =
    useState<string | number | string[]>("");

  const [postConditionQuestionIndex, setPostConditionQuestionIndex] =
    useState<number>(-1);
  const [postConditionValue, setPostConditionValue] =
    useState<string | number | string[]>("");
  const [postConditionNextPageId, setPostConditionNextPageId] =
    useState<string>("");

  // Helper to reset fields
  const resetPreConditionFields = () => {
    setPreConditionPageId("");
    setPreConditionQuestionIndex(-1);
    setPreConditionExpectedValue("");
  };

  const resetPostConditionFields = () => {
    setPostConditionQuestionIndex(-1);
    setPostConditionValue("");
    setPostConditionNextPageId("");
  };

  const handleAddPreCondition = () => {
    if (
      preConditionPageId === "" ||
      preConditionQuestionIndex < 0 ||
      preConditionExpectedValue === ""
    ) {
      alert("Please select a page, question, and expected value.");
      return;
    }

    onAddPreCondition({
      questionIndex: preConditionQuestionIndex,
      expectedValue: preConditionExpectedValue,
    });

    resetPreConditionFields();
  };

  const handleAddPostCondition = () => {
    if (
      postConditionQuestionIndex < 0 ||
      postConditionValue === "" ||
      postConditionNextPageId === ""
    ) {
      alert(
        "Please select a question, input a value, and choose the next page."
      );
      return;
    }

    onAddPostCondition({
      condition: {
        questionIndex: postConditionQuestionIndex,
        value: postConditionValue,
      },
      nextPageId: postConditionNextPageId,
    });

    resetPostConditionFields();
  };

  return (
    <div className="border p-4 rounded">
      <h2 className="font-semibold text-lg mb-4">
        Conditions for Page: {page.name}
      </h2>

      {/* Pre-Conditions Section */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Pre-Conditions</h3>
        <ul className="mb-4">
          {page.preConditions?.map((cond, index) => (
            <li
              key={index}
              className="border p-2 rounded mb-2 flex justify-between items-center"
            >
              <span>
                Question {cond.questionIndex + 1} from another page: Expected
                Value: <strong>{cond.expectedValue}</strong>
              </span>
              <button
                onClick={() => onDeletePreCondition(index)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          )) || <p>No pre-conditions defined.</p>}
        </ul>

        <div className="flex flex-col space-y-2">
          <select
            value={preConditionPageId}
            onChange={(e) => setPreConditionPageId(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select a page</option>
            {allPages
              .filter((p) => p.id !== page.id) // Exclude the current page
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
          {preConditionPageId && (
            <select
              value={preConditionQuestionIndex}
              onChange={(e) => setPreConditionQuestionIndex(Number(e.target.value))}
              className="border p-2 rounded"
            >
              <option value="-1">Select a question</option>
              {allPages
                .find((p) => p.id === preConditionPageId)
                ?.questions.map((q, index) => (
                  <option key={index} value={index}>
                    {index + 1}. {q.text}
                  </option>
                ))}
            </select>
          )}
          <input
            type="text"
            placeholder="Expected value"
            value={preConditionExpectedValue as string}
            onChange={(e) => setPreConditionExpectedValue(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={handleAddPreCondition}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Pre-Condition
          </button>
        </div>
      </div>

      {/* Post-Conditions Section */}
      <div>
        <h3 className="font-medium mb-2">Post-Conditions</h3>
        <ul className="mb-4">
          {page.postConditions?.map((cond, index) => (
            <li
              key={index}
              className="border p-2 rounded mb-2 flex justify-between items-center"
            >
              <span>
                If Question {cond.condition.questionIndex + 1} ={" "}
                <strong>{cond.condition.value}</strong>, go to page{" "}
                <strong>{cond.nextPageId}</strong>
              </span>
              <button
                onClick={() => onDeletePostCondition(index)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          )) || <p>No post-conditions defined.</p>}
        </ul>

        <div className="flex flex-col space-y-2">
          <select
            value={postConditionQuestionIndex}
            onChange={(e) => setPostConditionQuestionIndex(Number(e.target.value))}
            className="border p-2 rounded"
          >
            <option value="-1">Select a question</option>
            {page.questions.map((q, index) => (
              <option key={index} value={index}>
                {index + 1}. {q.text}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Value"
            value={postConditionValue as string}
            onChange={(e) => setPostConditionValue(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={postConditionNextPageId}
            onChange={(e) => setPostConditionNextPageId(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select next page</option>
            {allPages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddPostCondition}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Post-Condition
          </button>
        </div>
      </div>
    </div>
  );
}




