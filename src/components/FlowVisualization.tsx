"use client";

import React, { useState, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

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

const LOCAL_STORAGE_KEY_NODES = "flow-visualization-nodes";
const LOCAL_STORAGE_KEY_EDGES = "flow-visualization-edges";

export default function FlowVisualization({ flow }: FlowVisualizationProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!flow?.pages) return;

    // Load saved positions and edges from local storage
    const savedNodes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NODES) || "[]");
    const savedEdges = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_EDGES) || "[]");

    // Create nodes with saved positions or default ones
    const initialNodes: Node[] = flow.pages.map((page, pageIndex) => {
      const savedNode = savedNodes.find((node: Node) => node.id === `page-${page.id}`);
      return {
        id: `page-${page.id}`,
        type: "default",
        position: savedNode?.position || { x: pageIndex * 300, y: 50 },
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

    // Load or initialize edges
    const initialEdges: Edge[] = savedEdges.length
      ? savedEdges
      : [];

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [flow]);

  // Save node positions and edges on changes
  const handleNodesChange = (changes: any) => {
    onNodesChange(changes);

    const updatedNodes = nodes.map((node) => ({
      ...node,
      position: changes.find((change: any) => change.id === node.id)?.position || node.position,
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY_NODES, JSON.stringify(updatedNodes));
  };

  const handleEdgesChange = (changes: any) => {
    onEdgesChange(changes);
    localStorage.setItem(LOCAL_STORAGE_KEY_EDGES, JSON.stringify(edges));
  };

  const handleConnect = (connection: Connection) => {
    const updatedEdges = addEdge(connection, edges);
    setEdges(updatedEdges);
    localStorage.setItem(LOCAL_STORAGE_KEY_EDGES, JSON.stringify(updatedEdges));
  };

  return (
    <div style={{ width: "100%", height: "600px", border: "1px solid #ccc" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        style={{ backgroundColor: "#ffffff" }}
        connectionLineStyle={{ stroke: "#FFA032", strokeWidth: 2 }}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}




