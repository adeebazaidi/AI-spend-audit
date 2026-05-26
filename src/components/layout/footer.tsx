import Link from "next/link";
import { TrendingDown } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="h-6 w-6 rounded bg-foreground flex items-center justify-center shrink-0">
                <TrendingDown className="h-3.5 w-3.5 text-background" />
              </div>
              <span className="text-sm font-semibold">Spendwise AI</span>
            </Link>
            <p className="text-xs text-muted-foreground max-w-xs">
              Deterministic AI cost intelligence for engineering-led startups.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-col sm:flex-row gap-3 sm:gap-6">
            <Link
              href="/audit"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Run Audit
            </Link>
            <Link
              href="/#how-it-works"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              How it works
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40">
          <p className="text-xs text-muted-foreground/60 text-center">
            © {new Date().getFullYear()} Spendwise AI Inc. — Pricing data verified May 2025.
          </p>
        </div>
      </div>
    </footer>
  );
}
