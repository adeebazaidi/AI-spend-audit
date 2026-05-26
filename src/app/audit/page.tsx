import type { Metadata } from "next";
import { AuditForm } from "@/components/audit/audit-form";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Run AI Spend Audit",
  description:
    "Enter your current AI tooling stack and get an instant, deterministic savings report. Free, no signup required.",
};

export default function AuditPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Page header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/50 border border-border/60 rounded-full px-3 py-1 mb-5">
          <span className="font-mono">Step 1 of 1</span>
          <span>·</span>
          <span>~3 minutes</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">AI Spend Audit</h1>
        <p className="text-muted-foreground leading-relaxed">
          List every AI tool your team is currently paying for. Be precise about plan tier and
          seat count — that&apos;s where most savings hide.
        </p>
      </div>

      {/* Trust signals */}
      <div className="grid grid-cols-3 gap-3 mb-10">
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

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
        <span>No data stored without your consent · No integrations required</span>
      </div>

      <AuditForm />
    </div>
  );
}
