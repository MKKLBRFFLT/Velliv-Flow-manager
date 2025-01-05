"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addFlow } from "@/utils/flowStorage";

export default function HomePage() {
  const [flowName, setFlowName] = useState<string>("");
  const [flowDescription, setFlowDescription] = useState<string>("");
  const router = useRouter();

  const handleCreateFlow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flowName) return;

    const flowId = Date.now().toString();
    const newFlow = {
      id: flowId,
      name: flowName,
      description: flowDescription,
      questions: [],
      pages: [],
    };

    // Save the flow in local storage
    addFlow(newFlow);

    // Log the flow details
    console.log(JSON.stringify(newFlow, null, 2));

    // Redirect to the flow editing page
    router.push(`/flow/${flowId}`);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 space-y-8">
      {/* Create Flow Card */}
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Opret et nyt flow
        </h1>
        <form onSubmit={handleCreateFlow}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Flow navn
            </label>
            <input
              type="text"
              placeholder="Indtast flow navn"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Flow beskrivelse
            </label>
            <textarea
              placeholder="Indtast en kort beskrivelse"
              value={flowDescription}
              onChange={(e) => setFlowDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Opret Flow
          </button>
        </form>
      </div>

      {/* Load Flow Card */}
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Manage Existing Flows
        </h1>
        <p className="text-gray-600 text-center mb-4">
          This feature will allow you to view and manage existing flows.
        </p>
        <button
          type="button"
          className="w-full bg-gray-300 text-gray-700 py-2 rounded-md cursor-not-allowed"
        >
          Coming Soon
        </button>
      </div>
    </div>
  );
}
