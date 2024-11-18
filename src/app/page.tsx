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

    const flowId = Date.now().toString();
    const newFlow = { id: flowId, name: flowName, description: flowDescription, questions: [] };

    // Save the flow in local storage
    const flows = JSON.parse(localStorage.getItem('flows') || '[]') as Array<{ id: string; name: string; description: string; questions: any[] }>;
    flows.push(newFlow);
    localStorage.setItem('flows', JSON.stringify(flows));

    // Log the flow details
    console.log(JSON.stringify(newFlow, null, 2));

    // Redirect to the flow editing page
    router.push(`/flow/${flowId}`);
  };

  return (
    <div className='ml-48 p-6'>
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
          className="mt-4"
        />
        <button type="submit" className="mt-4">Create Flow</button>
      </form>
    </div>
  );
}




