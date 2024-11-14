'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [flowName, setFlowName] = useState<string>('');
  const [flowDescription, setFlowDescription] = useState<string>('');
  const router = useRouter();

  const handleCreateFlow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flowName) return;

    const flowId = Date.now().toString(); // Unique ID for the flow
    const newFlow = { id: flowId, name: flowName, description: flowDescription };

    // Save the flow in local storage
    const flows = JSON.parse(localStorage.getItem('flows') || '[]') as Array<{ id: string; name: string; description: string }>;
    flows.push(newFlow);
    localStorage.setItem('flows', JSON.stringify(flows));

    // Log the flow details in JSON format to the VS Code terminal
    console.log(JSON.stringify(newFlow, null, 2));

    // Redirect to the flow editing page
    router.push(`/flow/${flowId}`);
  };

  return (
    <div className="ml-48 p-6">
      <h1>Create a New Flow</h1>
      <form onSubmit={handleCreateFlow}>
        <input
          type="text"
          placeholder="Enter flow name"
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
        />
        <textarea
          placeholder="Enter a short description"
          value={flowDescription}
          onChange={(e) => setFlowDescription(e.target.value)}
        />
        <button type="submit">Create Flow</button>
      </form>
    </div>
  );
}



