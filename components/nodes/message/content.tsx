import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Node as DefaultNode } from "reactflow";

export type MessageContentProps = {
  selectedNode: DefaultNode;
  onMessageChange: (message: string) => void;
};

const MessageNodeContent = ({
  selectedNode,
  onMessageChange,
}: MessageContentProps) => {
  return (
    <div className="p-3">
      <Label className="text-muted-foreground text-sm" htmlFor="message">
        Text
      </Label>
      <Textarea
        id="message"
        onChange={(event) => onMessageChange(event.target.value)}
        placeholder="Type your message here."
        defaultValue={selectedNode.data.msg}
      />
    </div>
  );
};

export default MessageNodeContent;
