"use client";

import React, { useState } from "react";

import { Page, PreCondition, PostCondition } from "@/utils/types"; // Import shared types


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
    useState<string | number>("");
  const [preConditionOperator, setPreConditionOperator] =
    useState<string>("="); // Default operator

  const [postConditionQuestionIndex, setPostConditionQuestionIndex] =
    useState<number>(-1);
  const [postConditionValue, setPostConditionValue] = useState<string | number>(
    ""
  );
  const [postConditionOperator, setPostConditionOperator] =
    useState<string>("="); // Default operator
  const [postConditionNextPageId, setPostConditionNextPageId] =
    useState<string>("");

  const resetPreConditionFields = () => {
    setPreConditionPageId("");
    setPreConditionQuestionIndex(-1);
    setPreConditionExpectedValue("");
    setPreConditionOperator("=");
  };

  const resetPostConditionFields = () => {
    setPostConditionQuestionIndex(-1);
    setPostConditionValue("");
    setPostConditionOperator("=");
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
      operator: preConditionOperator,
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
        "Please select a question, input a value, choose an operator, and select the next page."
      );
      return;
    }

    onAddPostCondition({
      condition: {
        questionIndex: postConditionQuestionIndex,
        value: postConditionValue,
        operator: postConditionOperator,
      },
      nextPageId: postConditionNextPageId,
    });

    resetPostConditionFields();
  };

  const getInputField = (
    inputType: string,
    value: string | number,
    onChange: (value: string | number) => void
  ) => {
    return inputType === "number" ? (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border p-2 rounded"
        placeholder="Enter numeric value"
      />
    ) : (
      <input
        type="text"
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        className="border p-2 rounded"
        placeholder="Enter value"
      />
    );
  };

  const getOperatorDropdown = (
    operator: string,
    setOperator: (value: string) => void
  ) => (
    <select
      value={operator}
      onChange={(e) => setOperator(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="=">=</option>
      <option value=">">{">"}</option>
      <option value="<">{"<"}</option>
      <option value=">=">≥</option>
      <option value="<=">≤</option>
    </select>
  );

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
                Question {cond.questionIndex + 1} from another page:{" "}
                <strong>
                  {cond.operator} {cond.expectedValue}
                </strong>
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
              .filter((p) => p.id !== page.id)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
          {preConditionPageId && (
            <select
              value={preConditionQuestionIndex}
              onChange={(e) =>
                setPreConditionQuestionIndex(Number(e.target.value))
              }
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
          {preConditionQuestionIndex >= 0 &&
            allPages
              .find((p) => p.id === preConditionPageId)
              ?.questions[preConditionQuestionIndex].inputType === "number" &&
            getOperatorDropdown(preConditionOperator, setPreConditionOperator)}
          {preConditionQuestionIndex >= 0 &&
            getInputField(
              allPages
                .find((p) => p.id === preConditionPageId)
                ?.questions[preConditionQuestionIndex].inputType || "text",
              preConditionExpectedValue,
              setPreConditionExpectedValue
            )}
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
                If Question {cond.condition.questionIndex + 1}{" "}
                <strong>{cond.condition.operator}</strong>{" "}
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
            onChange={(e) =>
              setPostConditionQuestionIndex(Number(e.target.value))
            }
            className="border p-2 rounded"
          >
            <option value="-1">Select a question</option>
            {page.questions.map((q, index) => (
              <option key={index} value={index}>
                {index + 1}. {q.text}
              </option>
            ))}
          </select>
          {postConditionQuestionIndex >= 0 &&
            page.questions[postConditionQuestionIndex].inputType === "number" &&
            getOperatorDropdown(postConditionOperator, setPostConditionOperator)}
          {postConditionQuestionIndex >= 0 &&
            getInputField(
              page.questions[postConditionQuestionIndex].inputType,
              postConditionValue,
              setPostConditionValue
            )}
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
