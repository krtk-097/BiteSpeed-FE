import { MessageCircleMore, MoveLeft } from "lucide-react";
import { Node as DefaultNode } from "reactflow";
import MessageNodeContent, {
  MessageContentProps,
} from "./nodes/message/content";
import { Button } from "./ui/button";

type Node = {
  type: string;
  label: string;
  color: string;
  icon: JSX.Element;
  content: (props: MessageContentProps) => JSX.Element;
};

const nodeTypes: Node[] = [
  {
    type: "message",
    label: "Message",
    color: "#0077b6",
    icon: <MessageCircleMore size={24} />,
    content: (props) => <MessageNodeContent {...props} />,
  },
];

type Props = {
  selectedNode: DefaultNode | null;
  onMessageChange: (message: string) => void;
  onBackClick: (nodeId: string) => void;
};

const Sidebar = ({ selectedNode, onMessageChange, onBackClick }: Props) => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData("nodeData", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  function renderDrawerContent() {
    // If a node is selected, display the message input
    // Otherwise, display the node types
    if (selectedNode) {
      const nodeType = nodeTypes.find(
        (node) => node.type === selectedNode.type
      );
      return (
        <div>
          <div className="grid grid-cols-3 items-center border-b p-1">
            <Button
              onClick={() => onBackClick(selectedNode.id)}
              variant="outline"
              size="icon"
              className=" border-none"
            >
              <MoveLeft />
            </Button>
            <div className="justify-self-center">{nodeType?.label}</div>
          </div>
          {nodeType?.content({
            selectedNode,
            onMessageChange,
          })}
        </div>
      );
    }

    return (
      <div className="p-3">
        {nodeTypes.map((node) => {
          return (
            <div
              key={node.type}
              style={{
                borderColor: node.color,
                color: node.color,
              }}
              draggable
              onDragStart={(event) => onDragStart(event, node.type)}
              className=" cursor-pointer gap-1 p-2 border rounded mb-2 w-52 h-24 flex justify-center items-center flex-col hover:bg-accent transition-colors"
            >
              {node.icon}
              <div className="text-xl">{node.label}</div>
            </div>
          );
        })}
      </div>
    );
  }

  return <aside className="border-l">{renderDrawerContent()}</aside>;
};

export default Sidebar;
