import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-xl tracking-tighter">Spendwise AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-foreground/80 transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-foreground/80 transition-colors" href="#pricing">
            Pricing
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 lg:py-32 xl:py-48 flex justify-center text-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="inline-block rounded-full bg-muted px-3 py-1 text-sm mb-4 border border-border">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Average Savings: $12,400/yr
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl">
                Stop Overpaying for AI Infrastructure.
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Startups waste an average of 42% on redundant AI tooling, idle enterprise seats, and mismatched plans. Run a free, deterministic audit to see exactly where you can cut costs today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/audit">
                  <Button size="lg" className="h-12 px-8 group font-medium">
                    Run Free Audit
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/#demo">
                  <Button size="lg" variant="outline" className="h-12 px-8">
                    View Demo Report
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 bg-muted/50 border-y border-border/50 flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-2">
                <div className="h-12 w-12 rounded-lg bg-background border flex items-center justify-center mb-2">
                  <BarChart3 className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-xl font-bold">Deterministic Analysis</h3>
                <p className="text-muted-foreground">
                  No hallucinations. Our engine uses hard math and up-to-date pricing data across OpenAI, Anthropic, GitHub, and more.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-12 w-12 rounded-lg bg-background border flex items-center justify-center mb-2">
                  <ShieldCheck className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-xl font-bold">Detect Shadow IT</h3>
                <p className="text-muted-foreground">
                  Identify overlapping capabilities like paying for both Cursor and GitHub Copilot across different teams.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-12 w-12 rounded-lg bg-background border flex items-center justify-center mb-2">
                  <Zap className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-xl font-bold">Optimize Enterprise Spend</h3>
                <p className="text-muted-foreground">
                  Are you paying for 150 Enterprise seats when only 20 use it daily? We'll tell you exactly when to downgrade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial/Trust Section */}
        <section className="w-full py-24 flex justify-center">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-8">Trusted by fast-growing engineering teams</h2>
            <div className="mx-auto max-w-2xl bg-card border rounded-xl p-8 shadow-sm">
              <p className="text-lg italic text-muted-foreground mb-6">
                "Spendwise AI helped us consolidate our engineering toolchain and saved us $18k in ARR. The audit took 3 minutes and the ROI was immediate."
              </p>
              <div className="font-semibold">— CTO, Series B SaaS</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-border/40 py-6 flex justify-center items-center">
        <p className="text-sm text-muted-foreground">
          © 2024 Spendwise AI Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
