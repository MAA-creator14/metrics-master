"use client";

import { useState } from "react";
import { Handle, Position, NodeToolbar } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";

export interface MetricNodeData extends Record<string, unknown> {
  name: string;
  unit: string;
  explanation: string;
}

const VARIANT = {
  northStar: {
    border: "border-coral",
    bg: "bg-coral/10",
    nameColor: "text-coral",
    badge: "🎯 North Star",
    badgeColor: "text-coral/60",
  },
  leading: {
    border: "border-brand-teal/50",
    bg: "bg-brand-teal/10",
    nameColor: "text-brand-teal",
    badge: "📈 Leading Indicator",
    badgeColor: "text-brand-teal/60",
  },
  behaviour: {
    border: "border-brand-amber/50",
    bg: "bg-brand-amber/10",
    nameColor: "text-brand-amber",
    badge: "⚡ Behaviour",
    badgeColor: "text-brand-amber/60",
  },
} as const;

type VariantKey = keyof typeof VARIANT;

function MetricFlowNode({
  data,
  variant,
  isNorthStar,
}: {
  data: MetricNodeData;
  variant: VariantKey;
  isNorthStar: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const v = VARIANT[variant];

  return (
    <>
      {/* Explanation tooltip via NodeToolbar (renders outside RF viewport clip) */}
      <NodeToolbar isVisible={hovered && !!data.explanation} position={Position.Top} offset={8}>
        <div className="w-64 rounded-xl bg-bg-deep border border-ghost-border p-3 shadow-2xl">
          <p className="text-text-primary text-xs leading-relaxed">{data.explanation}</p>
        </div>
      </NodeToolbar>

      <div
        className={`rounded-2xl border-2 ${v.border} ${v.bg} px-4 py-3 cursor-default select-none`}
        style={{ width: 220 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {!isNorthStar && (
          <Handle
            type="target"
            position={Position.Top}
            style={{ opacity: 0, pointerEvents: "none" }}
          />
        )}

        <p className={`text-xs font-mono mb-1.5 ${v.badgeColor}`}>{v.badge}</p>
        <p className={`font-display font-semibold text-sm leading-snug ${v.nameColor}`}>
          {data.name}
        </p>
        {data.unit && (
          <p className="text-text-muted text-xs mt-1">{data.unit}</p>
        )}

        <Handle
          type="source"
          position={Position.Bottom}
          style={{ opacity: 0, pointerEvents: "none" }}
        />
      </div>
    </>
  );
}

export function NorthStarNode({ data }: NodeProps) {
  return (
    <MetricFlowNode
      data={data as MetricNodeData}
      variant="northStar"
      isNorthStar={true}
    />
  );
}

export function LeadingNode({ data }: NodeProps) {
  return (
    <MetricFlowNode
      data={data as MetricNodeData}
      variant="leading"
      isNorthStar={false}
    />
  );
}

export function BehaviourNode({ data }: NodeProps) {
  return (
    <MetricFlowNode
      data={data as MetricNodeData}
      variant="behaviour"
      isNorthStar={false}
    />
  );
}
