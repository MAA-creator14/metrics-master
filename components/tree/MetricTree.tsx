"use client";

import "@xyflow/react/dist/style.css";
import { useRef, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
  MarkerType,
  type Node,
  type Edge,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import type { MetricTree, Indicator } from "@/types";
import { NorthStarNode, LeadingNode, BehaviourNode } from "./MetricNode";
import type { MetricNodeData } from "./MetricNode";

// Must be at module level — React Flow re-renders if this object is recreated
const nodeTypes = {
  northStar: NorthStarNode,
  leading: LeadingNode,
  behaviour: BehaviourNode,
};

const NODE_WIDTH = 220;
const NODE_HEIGHT = 90;

function layoutTree(tree: MetricTree): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 52, ranksep: 72 });

  g.setNode(tree.northStar.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  for (const ind of tree.indicators) {
    g.setNode(ind.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    g.setEdge(ind.parentId, ind.id);
  }
  dagre.layout(g);

  const nodes: Node[] = [
    {
      id: tree.northStar.id,
      type: "northStar",
      position: {
        x: g.node(tree.northStar.id).x - NODE_WIDTH / 2,
        y: g.node(tree.northStar.id).y - NODE_HEIGHT / 2,
      },
      data: {
        name: tree.northStar.name,
        unit: tree.northStar.unit,
        explanation: "",
      } as MetricNodeData,
    },
    ...tree.indicators.map((ind: Indicator): Node => ({
      id: ind.id,
      type: ind.type === "leading" ? "leading" : "behaviour",
      position: {
        x: g.node(ind.id).x - NODE_WIDTH / 2,
        y: g.node(ind.id).y - NODE_HEIGHT / 2,
      },
      data: {
        name: ind.name,
        unit: ind.unit,
        explanation: ind.causalExplanation,
      } as MetricNodeData,
    })),
  ];

  const edges: Edge[] = tree.indicators.map((ind: Indicator): Edge => ({
    id: `e-${ind.parentId}-${ind.id}`,
    source: ind.parentId,
    target: ind.id,
    markerEnd: { type: MarkerType.ArrowClosed, color: "#3a3a5c" },
    style: { stroke: "#3a3a5c", strokeWidth: 1.5 },
  }));

  return { nodes, edges };
}

function MobileTreeView({ tree }: { tree: MetricTree }) {
  const b1l2 = tree.indicators.find((i) => i.branch === 1 && i.level === 2);
  const b1l3 = tree.indicators.find((i) => i.branch === 1 && i.level === 3);
  const b2l2 = tree.indicators.find((i) => i.branch === 2 && i.level === 2);
  const b2l3 = tree.indicators.find((i) => i.branch === 2 && i.level === 3);

  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto">
      <div className="rounded-2xl border-2 border-coral bg-coral/10 px-4 py-3">
        <p className="text-coral text-xs font-mono mb-1">🎯 North Star</p>
        <p className="font-display font-semibold text-text-primary">{tree.northStar.name}</p>
        {tree.northStar.unit && (
          <p className="text-text-muted text-xs mt-0.5">{tree.northStar.unit}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {b1l2 && (
          <div className="flex flex-col gap-2">
            <div className="rounded-xl border border-brand-teal/40 bg-brand-teal/10 px-3 py-2.5">
              <p className="text-brand-teal text-xs font-mono mb-0.5">📈 Leading Indicator</p>
              <p className="font-display font-semibold text-brand-teal text-sm">{b1l2.name}</p>
              {b1l2.unit && <p className="text-text-muted text-xs mt-0.5">{b1l2.unit}</p>}
            </div>
            {b1l3 && (
              <div className="ml-4 rounded-xl border border-brand-amber/40 bg-brand-amber/10 px-3 py-2.5">
                <p className="text-brand-amber text-xs font-mono mb-0.5">⚡ Behaviour</p>
                <p className="font-display font-semibold text-brand-amber text-sm">{b1l3.name}</p>
                {b1l3.unit && <p className="text-text-muted text-xs mt-0.5">{b1l3.unit}</p>}
              </div>
            )}
          </div>
        )}

        {b2l2 && (
          <div className="flex flex-col gap-2">
            <div className="rounded-xl border border-brand-teal/40 bg-brand-teal/10 px-3 py-2.5">
              <p className="text-brand-teal text-xs font-mono mb-0.5">📈 Leading Indicator</p>
              <p className="font-display font-semibold text-brand-teal text-sm">{b2l2.name}</p>
              {b2l2.unit && <p className="text-text-muted text-xs mt-0.5">{b2l2.unit}</p>}
            </div>
            {b2l3 && (
              <div className="ml-4 rounded-xl border border-brand-amber/40 bg-brand-amber/10 px-3 py-2.5">
                <p className="text-brand-amber text-xs font-mono mb-0.5">⚡ Behaviour</p>
                <p className="font-display font-semibold text-brand-amber text-sm">{b2l3.name}</p>
                {b2l3.unit && <p className="text-text-muted text-xs mt-0.5">{b2l3.unit}</p>}
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-text-muted text-xs text-center mt-2 font-mono">
        Open on desktop for the interactive tree ↗
      </p>
    </div>
  );
}

interface Props {
  tree: MetricTree;
}

export function MetricTreeCanvas({ tree }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => layoutTree(tree),
    // tree.id is stable; full tree dep would re-run unnecessarily
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tree.id]
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  async function handleExportPng() {
    if (!canvasRef.current) return;
    const { toPng } = await import("html-to-image");
    const filename = `metric-tree-${tree.northStar.name
      .toLowerCase()
      .replace(/\s+/g, "-")}.png`;
    const dataUrl = await toPng(canvasRef.current, {
      backgroundColor: "#16213e",
      pixelRatio: 2,
    });
    const a = document.createElement("a");
    a.download = filename;
    a.href = dataUrl;
    a.click();
  }

  return (
    <>
      {/* Desktop: React Flow canvas */}
      <div ref={canvasRef} className="hidden md:block w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#3a3a5c" gap={24} size={1} />
          <Controls showInteractive={false} />
          <Panel position="bottom-right">
            <button
              onClick={handleExportPng}
              className="px-4 py-2 rounded-full bg-surface border border-ghost-border
                         text-text-muted text-sm hover:border-brand-teal hover:text-brand-teal
                         transition-colors shadow-lg"
            >
              Export PNG
            </button>
          </Panel>
        </ReactFlow>
      </div>

      {/* Mobile: simplified card list */}
      <div className="md:hidden w-full">
        <MobileTreeView tree={tree} />
      </div>
    </>
  );
}
