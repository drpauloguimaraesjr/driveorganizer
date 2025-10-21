import { Link, useLocation } from "wouter";
import { FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="flex gap-2">
      <Link href="/">
        <Button
          variant={location === "/" ? "default" : "ghost"}
          size="sm"
          className="gap-2"
          data-testid="nav-pdf-manager"
        >
          <FileText className="h-4 w-4" />
          PDFs
        </Button>
      </Link>
      <Link href="/search">
        <Button
          variant={location === "/search" ? "default" : "ghost"}
          size="sm"
          className="gap-2"
          data-testid="nav-search"
        >
          <Search className="h-4 w-4" />
          Pesquisar
        </Button>
      </Link>
    </nav>
  );
}
