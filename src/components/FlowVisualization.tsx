"use client";

import React, { useEffect, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

type Question = {
  text: string;
  inputType: string;
};

type PreCondition = {
  questionIndex: number;
  expectedValue: string | number | string[];
};

type Page = {
  id: string;
  name: string;
  questions: Question[];
  preConditions?: PreCondition[];
  postConditions?: Array<{
    condition: { questionIndex: number; value: string | number | string[] };
    nextPageId: string;
  }>;
};

type FlowVisualizationProps = {
  flow: {
    pages: Page[];
  };
};

const LOCAL_STORAGE_KEY_NODES = "flow-visualization-nodes";

export default function FlowVisualization({ flow }: FlowVisualizationProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!flow?.pages) return;

    // Load saved positions from local storage
    const savedNodes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NODES) || "[]");

    // Create nodes with saved positions or calculate relative positions
    const initialNodes: Node[] = flow.pages.map((page, pageIndex) => {
      const savedNode = savedNodes.find((node: Node) => node.id === `page-${page.id}`);
      const lastNodePosition =
        savedNodes[savedNodes.length - 1]?.position || { x: (pageIndex - 1) * 300, y: 50 };

      return {
        id: `page-${page.id}`,
        type: "default",
        position:
          savedNode?.position ||
          (pageIndex === flow.pages.length - 1 // Newest node closer to the last
            ? { x: lastNodePosition.x + 200, y: lastNodePosition.y + 100 }
            : { x: pageIndex * 300, y: 50 }),
        data: {
          label: (
            <div style={{ color: "#FFFFFF" }}>
              <h3>{page.name}</h3>
              <ul>
                {page.questions.map((q, qIndex) => (
                  <li key={`q-${qIndex}`}>
                    {q.text} ({q.inputType})
                  </li>
                ))}
              </ul>
            </div>
          ),
        },
        style: {
          backgroundColor: "#006E64",
          border: "1px solid #000",
          borderRadius: 5,
        },
      };
    });

    // Create edges for post-conditions
    const postConditionEdges: Edge[] = flow.pages.flatMap((page) =>
      page.postConditions?.map((condition, index) => {
        const targetPage = flow.pages.find((p) => p.id === condition.nextPageId);
        if (targetPage) {
          return {
            id: `post-edge-${page.id}-${index}`,
            source: `page-${page.id}`,
            target: `page-${targetPage.id}`,
            label: `If "${condition.condition.value}"`,
            labelStyle: { fill: "#FFA032", fontWeight: "bold" },
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#FFA032",
            },
            style: { stroke: "#FFA032", strokeWidth: 2 },
          };
        }
        return null;
      }) || []
    ).filter((edge) => edge !== null);

    // Create edges for pre-conditions
    const preConditionEdges: Edge[] = flow.pages.flatMap((page, pageIndex) =>
      page.preConditions?.map((condition, index) => {
        // Identify the source page based on the question index
        const sourcePage = flow.pages.find(
          (p) => p.questions.length > condition.questionIndex && flow.pages.indexOf(p) < pageIndex
        );
        if (sourcePage) {
          return {
            id: `pre-edge-${page.id}-${index}`,
            source: `page-${sourcePage.id}`,
            target: `page-${page.id}`,
            label: `Depends on "${condition.expectedValue}"`,
            labelStyle: { fill: "#4CAF50", fontWeight: "bold" },
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#4CAF50",
            },
            style: { stroke: "#4CAF50", strokeWidth: 2, strokeDasharray: "5 5" }, // Dashed line for pre-conditions
          };
        }
        return null;
      }) || []
    ).filter((edge) => edge !== null);

    // Combine pre-condition and post-condition edges
    const initialEdges = [...postConditionEdges, ...preConditionEdges];

    setNodes(initialNodes);
    setEdges(initialEdges as Edge[]);
  }, [flow]);

  // Save node positions on change
  const handleNodesChange = (changes: any) => {
    onNodesChange(changes);

    const updatedNodes = nodes.map((node) => ({
      ...node,
      position: changes.find((change: any) => change.id === node.id)?.position || node.position,
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY_NODES, JSON.stringify(updatedNodes));
  };

  return (
    <div style={{ width: "100%", height: "600px", border: "1px solid #ccc" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        style={{ backgroundColor: "#ffffff" }}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}








