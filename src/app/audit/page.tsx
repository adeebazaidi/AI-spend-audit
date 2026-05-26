import type { Metadata } from "next";
import { AuditForm } from "@/components/audit/audit-form";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Run AI Spend Audit",
  description:
    "Enter your current AI tooling stack and get an instant, deterministic savings report. Free, no signup required.",
};

export default function AuditPage() {
  return (
    <div className="min-h-screen">
      {/* Minimal header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-4xl flex items-center gap-4 h-14 px-4 md:px-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            No data stored without your consent
          </div>
        </div>
      </header>

      <div className="container max-w-4xl py-12 md:py-16 px-4 md:px-6">
        {/* Page header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/50 border border-border/60 rounded-full px-3 py-1 mb-4">
            <span className="font-mono">Step 1 of 1</span>
            <span>—</span>
            <span>Takes ~3 minutes</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            AI Spend Audit
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            List every AI tool your team is currently paying for. Be precise about plan
            tier and seat count — that's where most savings hide. You don't need exact
            spend figures; we'll calculate from pricing data if you're unsure.
          </p>
        </div>

        {/* Trust signals */}
        <div className="grid grid-cols-3 gap-3 mb-10 max-w-lg">
          {[
            { label: "Avg. audit time", value: "3 min" },
            { label: "Savings rules", value: "7 active" },
            { label: "Tools covered", value: "9 platforms" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 text-center"
            >
              <div className="text-base font-bold font-mono">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <AuditForm />
      </div>
    </div>
  );
}
