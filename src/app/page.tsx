"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addFlow } from "@/utils/flowStorage";
import { saveFlows } from "@/utils/flowStorage";

export default function HomePage() {
  const [flowName, setFlowName] = useState<string>("");
  const [flowDescription, setFlowDescription] = useState<string>("");
  const [loadedFlows, setLoadedFlows] = useState<any[]>([]);
  const router = useRouter();

  const handleCreateFlow = async (e: React.FormEvent) => {
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

    //Save the flow in local storage
    addFlow(newFlow);

    // Log the flow details
    console.log(JSON.stringify(newFlow, null, 2));

    // Save to mongo
    try {
      const response = await fetch("/api/flows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFlow),
      });

      if (!response.ok) {
        console.error("Failed to save flow to MongoDB:", response.statusText);
      } else {
        console.log("Flow successfully saved to MongoDB");
      }
    } catch (error) {
      console.error("Error saving flow to MongoDB:", error);
    }

    // Redirect to the flow editing page
    router.push(`/flow/${flowId}`);
  };

  const handleLoadFlows = async () => {
    try {
      const response = await fetch("/api/flows");
      if (!response.ok) {
        throw new Error(`Failed to load flows from DB: ${response.statusText}`);
      }
      const data = await response.json();
      const flowsFromDB = data.flows;

      saveFlows(flowsFromDB);

      console.log("Flows loaded from DB and saved to local storage.");

      setLoadedFlows(flowsFromDB);
    } catch (err) {
      console.error("Error loading flows:", err);
    }
  };

  const handleUploadFlow = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    try {
      const text = await file.text();
      const parsedFlow = JSON.parse(text);

      // In case the id already exists in the database
      parsedFlow.id = Date.now().toString();
  
      const isValidFlow =
        parsedFlow &&
        typeof parsedFlow.id === "string" &&
        typeof parsedFlow.name === "string" &&
        typeof parsedFlow.description === "string" &&
        Array.isArray(parsedFlow.pages);
  
      if (!isValidFlow) {
        alert("Ugyldigt flow format.");
        return;
      }
  
      if (parsedFlow._id) {
        delete parsedFlow._id;
      }
  
      addFlow(parsedFlow);
  
      try {
        const response = await fetch("/api/flows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsedFlow),
        });
  
        if (!response.ok) {
          alert("Kunne ikke gemme flow i databasen.");
        } else {
          alert("Dit Flow er nu uploadet!");
          router.push(`/flow/${parsedFlow.id}`);
        }
      } catch {
        alert("Kunne ikke gemme flow i databasen.");
      }
    } catch {
      alert("Kunne ikke læse filen.");
    } finally {
      event.target.value = "";
    }
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

      
      {/* Upload Flow Card */}
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Upload et eksisterende flow
        </h1>
        <input
          type="file"
          accept="application/json"
          onChange={handleUploadFlow}
          className="block w-full text-sm text-gray-600 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
  />
      </div>


      {/* Manage (Load) Flows Card */}
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Rediger eksisterende flows
        </h1>
        <p className="text-gray-600 text-center mb-4">
          Se og arbejd videre på flows i databasen.
        </p>
        <button
          type="button"
          onClick={handleLoadFlows}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 mb-4"
        >
          Load Flows
        </button>

        {/* Display loaded flows */}
        {loadedFlows.length === 0 ? (
          <p className="text-center text-gray-500">Ingen flows loadede endnu.</p>
        ) : (
          <ul className="space-y-2">
            {loadedFlows.map((flow) => (
              <li
                key={flow.id}
                className="border p-2 rounded cursor-pointer hover:bg-gray-200"
                onClick={() => router.push(`/flow/${flow.id}`)}
              >
                <p className="font-medium">{flow.name}</p>
                <p className="text-sm text-gray-600">{flow.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
