import Link from "next/link";
import { TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-7 w-7 rounded-md bg-foreground flex items-center justify-center shrink-0 group-hover:bg-foreground/90 transition-colors">
            <TrendingDown className="h-4 w-4 text-background" />
          </div>
          <span className="font-semibold text-sm tracking-tight">Spendwise AI</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/#how-it-works"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-muted/60"
          >
            How it works
          </Link>
          <Link
            href="/#social-proof"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-muted/60"
          >
            Results
          </Link>
        </nav>

        {/* CTA */}
        <Link href="/audit">
          <Button size="sm" className="h-8 px-4 text-xs font-semibold">
            Free Audit →
          </Button>
        </Link>
      </div>
    </header>
  );
}
