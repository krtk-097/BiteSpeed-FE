"use client";
import { localStorageKey } from "@/lib/utils";
import { useCallback, useMemo, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import Navbar from "./navbar";
import Message from "./nodes/message";
import Sidebar from "./sidebar";

const toastDuration = 3000;

// Get the initial nodes from local storage if available, else return default nodes
function getInitialNodes() {
  if (typeof window !== "undefined" && window.localStorage) {
    const itemsInLocalStorage = localStorage.getItem(localStorageKey);

    if (itemsInLocalStorage) {
      // deselect all nodes when loading from local storage
      return JSON.parse(itemsInLocalStorage).nodes.map((node: Node) => ({
        ...node,
        selected: false,
      }));
    }

    return [
      {
        id: "1",
        position: { x: 0, y: 0 },
        data: { msg: "Message Node 1" },
        type: "message",
      },
      {
        id: "2",
        position: { x: 400, y: 0 },
        data: { msg: "Message Node 2" },
        type: "message",
      },
    ];
  }
}

// Get the initial edges from local storage if available, else return default edges
function getInitialEdges() {
  if (typeof window !== "undefined" && window.localStorage) {
    const itemsInLocalStorage = localStorage.getItem(localStorageKey);

    if (itemsInLocalStorage) {
      return JSON.parse(itemsInLocalStorage).edges;
    }

    return [{ id: "e1-2", source: "1", target: "2" }];
  }
}

const initialNodes = getInitialNodes();
const initialEdges = getInitialEdges();

const ReactFlowWrapper = () => {
  const reactFlowRef = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const nodeTypes = useMemo(() => ({ message: Message }), []);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  // Add a new node when a node is dropped from the sidebar
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      // Get the node type from the dataTransfer object
      const type = event.dataTransfer.getData("nodeData");

      if (typeof type === "undefined" || !type || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: uuidv4(), // Generate a unique id for the node
        type,
        position,
        data: { msg: "Message Node" },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Add an edge when a connection is made
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Set the drop effect to move when dragging over the pane
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Set the selected node when a node is clicked or dragged
  // This will be used to display the message input in the sidebar
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onNodeDrag = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Clear the selected node when the pane is clicked
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Clear the selected node when the back button is clicked inside the sidebar and deselect the node
  const onBackClick = useCallback(
    (nodeId: string) => {
      setSelectedNode(null);

      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                selected: false,
              }
            : node
        )
      );
    },
    [setNodes]
  );

  // Update the message of the selected node when the input changes
  const handleSelectedNodeMessageChange = useCallback(
    (message: string) => {
      if (selectedNode) {
        const updatedNode = {
          ...selectedNode,
          data: { ...selectedNode.data, msg: message },
        };

        setNodes((nds) =>
          nds.map((node) => (node.id === selectedNode.id ? updatedNode : node))
        );
      }
    },
    [selectedNode, setNodes]
  );

  const handleOnSave = useCallback(() => {
    // check if there are more than one node and more than one node has empty handles
    // if so, show an error message else save the data
    if (nodes.length > 1) {
      const disconnectedNodes = nodes.filter(
        (node) =>
          !edges.some(
            (edge) => edge.source === node.id || edge.target === node.id
          )
      );

      if (disconnectedNodes.length > 0) {
        return toast.error("Please connect all nodes before saving", {
          duration: toastDuration,
        });
      }

      if (reactFlowInstance) {
        const flow = reactFlowInstance.toObject();
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem(localStorageKey, JSON.stringify(flow));
          toast.success("Data saved successfully", { duration: toastDuration });
        }
      }
    }
  }, [nodes, edges, reactFlowInstance]);

  return (
    <div className="h-screen w-screen">
      <Navbar onSave={handleOnSave} />
      <div className="h-full w-full grid grid-cols-4">
        <ReactFlow
          className="col-span-3"
          fitView
          edges={edges}
          nodes={nodes}
          ref={reactFlowRef}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onConnect={onConnect}
          onNodeDrag={onNodeDrag}
          onDragOver={onDragOver}
          onPaneClick={onPaneClick}
          onNodeClick={onNodeClick}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={setReactFlowInstance}
        />
        <Sidebar
          selectedNode={selectedNode}
          onBackClick={onBackClick}
          onMessageChange={handleSelectedNodeMessageChange}
        />
      </div>
    </div>
  );
};

export default ReactFlowWrapper;
