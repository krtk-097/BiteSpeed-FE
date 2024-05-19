"use client";
import { MessageCircleMore } from "lucide-react";
import Image from "next/image";
import { Handle, Position } from "reactflow";
import CustomHandle from "../../customHandle";

type Props = {
  data: { msg: string };
  selected?: boolean;
};

type ContentProps = {
  msg: string;
  isSelected?: boolean;
};

const Content = ({ msg, isSelected }: ContentProps) => {
  return (
    <div
      className={`border shadow-lg w-80 ${
        isSelected ? "outline outline-blue-600" : ""
      }`}
    >
      <div className="bg-cyan-200 py-1 px-2 flex justify-between items-center">
        <div className="flex items-center gap-1 font-bold">
          <MessageCircleMore size={16} />
          Send Message
        </div>
        <Image
          src="/social/whatsapp.svg"
          alt="close"
          width={18}
          height={18}
          className="cursor-pointer  "
        />
      </div>
      <div className="p-2">{msg}</div>
    </div>
  );
};

function Message({ data, selected }: Props) {
  return (
    <div>
      <Handle type="target" position={Position.Left} />
      <Content msg={data.msg} isSelected={selected} />
      <CustomHandle type="source" position={Position.Right} />
    </div>
  );
}

export default Message;
