"use client";
import { useMemo } from "react";
import {
  getConnectedEdges,
  Handle,
  HandleProps,
  Node,
  ReactFlowState,
  useNodeId,
  useStore,
} from "reactflow";

const selector = ({ nodeInternals, edges }: ReactFlowState) => ({
  nodeInternals,
  edges,
});

const CustomHandle = (props: HandleProps) => {
  const { nodeInternals, edges } = useStore(selector);
  const nodeId = useNodeId();

  // Check if the node already has a source edge
  // If it does, it should not be connectable
  const isHandleConnectable = useMemo(() => {
    const node = nodeInternals.get(nodeId as string);
    const connectedEdges = getConnectedEdges([node as Node], edges);
    const sourceEdges = connectedEdges.filter((edge) => edge.source === nodeId);

    return sourceEdges.length < 1;
  }, [nodeInternals, edges, nodeId]);

  return <Handle {...props} isConnectable={isHandleConnectable}></Handle>;
};

export default CustomHandle;
