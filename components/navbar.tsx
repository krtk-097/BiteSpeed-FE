import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

type Props = {
  onSave: () => void;
};

const Navbar = ({ onSave }: Props) => {
  return (
    <div className="p-2 flex justify-end items-center bg-gray-100">
      <Button onClick={onSave} className="mr-12" size="sm" variant="outline">
        Save Changes
      </Button>
    </div>
  );
};

export default Navbar;
