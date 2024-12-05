'use client';

import React from 'react';
import ReactFlow, { Controls, Background, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

type FlowVisualizationProps = {
  flow: {
    pages: Array<{
      id: string;
      name: string;
      questions: Array<{
        text: string;
        inputType: string;
      }>;
    }>;
  };
};

export default function FlowVisualization({ flow }: FlowVisualizationProps) {
  if (!flow?.pages) return <div>No flow data available</div>;

  // Create nodes for pages and questions
  const nodes: Node[] = flow.pages.map((page, pageIndex) => ({
    id: `page-${page.id}`,
    type: 'default',
    position: { x: pageIndex * 300, y: 50 },
    data: {
      label: (
        <div>
          <h3>{page.name}</h3>
          <ul>
            {page.questions.map((q, qIndex) => (
              <li key={`q-${qIndex}`}>{q.text} ({q.inputType})</li>
            ))}
          </ul>
        </div>
      ),
    },
  }));

  // Create edges between pages (linear flow for now)
  const edges: Edge[] = flow.pages.slice(1).map((_, pageIndex) => ({
    id: `edge-${pageIndex}`,
    source: `page-${flow.pages[pageIndex].id}`,
    target: `page-${flow.pages[pageIndex + 1].id}`,
    animated: true,
  }));

  return (
    <div style={{ width: '100%', height: '400px', border: '1px solid #ccc' }}>
      <ReactFlow nodes={nodes} edges={edges}>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
