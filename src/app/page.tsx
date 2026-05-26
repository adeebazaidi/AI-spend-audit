import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Zap,
  TrendingDown,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

const TOOLS = ["Cursor", "Claude", "ChatGPT", "GitHub Copilot", "Gemini", "Windsurf"];

const FEATURES = [
  {
    icon: BarChart3,
    title: "Deterministic. Not AI Guesswork.",
    description:
      "Every recommendation is backed by hard pricing math — not LLM inference. We won't tell you to 'consider renegotiating' without telling you the exact dollar figure.",
  },
  {
    icon: ShieldCheck,
    title: "Detect Shadow Redundancy",
    description:
      "Paying for Cursor AND GitHub Copilot? That's $100+/seat wasted. We surface overlapping capabilities across your entire toolchain automatically.",
  },
  {
    icon: Zap,
    title: "3-Minute Audit. Immediate ROI.",
    description:
      "No integrations. No OAuth. No month-long onboarding. Fill out what you're currently paying and we give you a shareable report instantly.",
  },
];

const STATS = [
  { value: "$12,400", label: "Avg. annual savings per startup" },
  { value: "42%", label: "Of AI spend is typically redundant" },
  { value: "3 min", label: "Average audit completion time" },
];

const TESTIMONIALS = [
  {
    quote:
      "We were paying for Cursor Enterprise AND GitHub Copilot Business for 8 engineers. Spendwise caught it in seconds. We cancelled Copilot the same day.",
    author: "Priya M.",
    role: "CTO, Series A DevTools startup",
    savings: "$3,744/yr saved",
  },
  {
    quote:
      "The report showed we were on Claude Team with 3 users — below the 5-seat minimum. We dropped to Pro plans and immediately saved $90/mo. Obvious in hindsight.",
    author: "James K.",
    role: "Head of Engineering, B2B SaaS",
    savings: "$1,080/yr saved",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Enter your current tooling",
    description:
      "List each AI tool, the plan you're on, monthly spend, and seat count. Takes 2 minutes.",
  },
  {
    step: "02",
    title: "Engine runs deterministic analysis",
    description:
      "Our rules engine evaluates 7 savings heuristics: redundancy, over-provisioning, tier mismatches, and minimum-seat traps.",
  },
  {
    step: "03",
    title: "Get a shareable savings report",
    description:
      "Receive a clean, link-shareable report with line-by-line recommendations you can action immediately — no signup required.",
  },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative w-full pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden text-center">
        {/* Grid bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--border)/0.4) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)/0.4) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 80% 55% at 50% 0%, black 40%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 55% at 50% 0%, black 40%, transparent 100%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              Average savings identified:{" "}
              <span className="text-foreground font-semibold ml-0.5">$12,400/yr</span>
            </div>

            <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl leading-[0.95] max-w-3xl">
              Stop Overpaying for{" "}
              <span className="relative inline-block">
                <span className="relative z-10">AI Infrastructure.</span>
                <span
                  className="absolute bottom-1 left-0 right-0 h-3 z-0 opacity-20 bg-foreground"
                  style={{ transform: "skew(-2deg)" }}
                />
              </span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
              Startups waste{" "}
              <span className="text-foreground font-medium">42% on redundant AI tooling</span>,
              idle enterprise seats, and minimum-seat traps. Run a free 3-minute audit — no
              signup, no integrations.
            </p>

            {/* Tool chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium">Audits:</span>
              {TOOLS.map((tool) => (
                <span
                  key={tool}
                  className="px-2.5 py-1 rounded-full border border-border/60 bg-muted/40 font-medium text-foreground/70"
                >
                  {tool}
                </span>
              ))}
              <span>+ more</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link href="/audit">
                <Button size="lg" className="h-11 px-8 font-semibold text-sm group">
                  Run Free Audit — 3 minutes
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/report/results?data=eyJ0ZWFtU2l6ZSI6MTAsInByaW1hcnlVc2VDYXNlIjoiY29kaW5nIiwidG9vbHMiOlt7InRvb2wiOiJDdXJzb3IiLCJwbGFuIjoiSW5kaXZpZHVhbC9Qcm8iLCJtb250aGx5U3BlbmQiOjIwMCwic2VhdHMiOjEwfSx7InRvb2wiOiJHaXRIdWIgQ29waWxvdCIsInBsYW4iOiJUZWFtIiwibW9udGhseVNwZW5kIjoxOTAsInNlYXRzIjoxMH1dfQ==">
                <Button size="lg" variant="outline" className="h-11 px-8 text-sm font-medium">
                  View Sample Report <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground/50">
              No account · No credit card · Shareable report link
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-y border-border/50 bg-muted/20 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-border/50 max-w-2xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center px-4 md:px-8">
                <div className="text-2xl md:text-3xl font-bold tracking-tight font-mono">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1 leading-snug">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-3">
              Built for engineering-led startups
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The people who approve AI tooling budgets need numbers, not vibes. Spendwise gives
              you both.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex flex-col gap-3 p-6 rounded-xl border border-border/60 bg-card hover:border-border transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <f.icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="text-sm font-semibold leading-snug">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 border-y border-border/50 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-3">
              How it works
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              No smoke and mirrors. Here&apos;s exactly what the engine does.
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-3 max-w-4xl mx-auto">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="flex flex-col gap-3">
                <div className="font-mono text-4xl font-bold text-foreground/10">{s.step}</div>
                <h3 className="text-sm font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/audit">
              <Button size="lg" className="h-11 px-8 font-semibold text-sm group">
                Start Your Free Audit
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section id="social-proof" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-3">
              Teams that ran the audit, saved real money
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              These aren&apos;t hypothetical. These are specific over-payments our engine found.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="p-6 rounded-xl border border-border/60 bg-card flex flex-col gap-4"
              >
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                  <div>
                    <div className="text-sm font-semibold">{t.author}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="h-3 w-3" />
                    {t.savings}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 border-t border-border/50 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <TrendingDown className="mx-auto h-8 w-8 text-muted-foreground mb-6" />
            <h2 className="text-4xl font-bold tracking-tighter mb-4">
              Your next board deck needs this number.
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Find out in 3 minutes exactly how much your startup is wasting on AI tooling — and
              get a shareable report to prove it.
            </p>
            <Link href="/audit">
              <Button size="lg" className="h-12 px-10 font-semibold text-base group">
                Run Free AI Spend Audit
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground/50 mt-4">
              No signup · No credit card · Shareable report link
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
