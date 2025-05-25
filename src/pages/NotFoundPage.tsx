import { Home } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="text-6xl font-bold text-primary mb-4">404</div>
      <div className="text-xl font-semibold mb-2">Page Not Found</div>
      <div className="text-muted-foreground mb-6">The page you are looking for does not exist.</div>
      <Button onClick={() => window.location.href = "/"} aria-label="Return to home">
        <Home className="mr-2 h-5 w-5" />
        Return to Home
      </Button>
    </div>
  );
}