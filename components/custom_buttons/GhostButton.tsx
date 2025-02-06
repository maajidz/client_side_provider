import { Button } from "../ui/button";

interface GhostButtonProps {
  label: string;
  onClick?: () => void;
}

function GhostButton({ label, onClick }: GhostButtonProps) {
  return (
    <Button
      variant="ghost"
      className="text-sm cursor-pointer text-blue-600 hover:text-blue-600 hover:bg-transparent"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

export default GhostButton;
