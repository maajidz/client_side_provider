import { Button } from "@/components/ui/button";

interface GhostButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

function GhostButton({ children, onClick }: GhostButtonProps) {
  return (
    <Button
      variant="ghost"
      className="text-sm cursor-pointer text-blue-600 hover:text-blue-600 hover:bg-transparent"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export default GhostButton;
