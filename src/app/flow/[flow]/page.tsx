'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Flow = {
  id: string;
  name: string;
  description: string;
};

export default function FlowEditor() {
  const params = useParams();
  const [flowName, setFlowName] = useState<string>('');
  const [flowDescription, setFlowDescription] = useState<string>('');

  useEffect(() => {
    const flowId = params.flow as string;
    if (flowId) {
      const flows = JSON.parse(localStorage.getItem('flows') || '[]') as Flow[];
      const flow = flows.find((f) => f.id === flowId);
      if (flow) {
        setFlowName(flow.name);
        setFlowDescription(flow.description);
      }
    }
  }, [params.flow]);

  return (
    <div className="ml-48 p-6">
      <h1>Editing Flow: {flowName}</h1>
      <p>{flowDescription}</p>
      {/* More flow editing features can be added here */}
    </div>
  );
}


