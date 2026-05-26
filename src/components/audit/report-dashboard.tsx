"use client";

import { useEffect, useState } from "react";
import { runAudit, AuditResult, AuditContext } from "@/lib/audit-engine";
import { generateAiSummary } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  Share2,
  Zap,
  Check,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { getReport, captureLead } from "@/lib/supabase";

const REC_LABELS: Record<string, string> = {
  downgrade: "Downgrade Plan",
  consolidate: "Eliminate Redundancy",
  switch: "Switch to API",
  rightsize: "Right-Size Seats",
  keep: "Optimised ✓",
};

const REC_COLORS: Record<string, string> = {
  downgrade: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  consolidate: "bg-red-500/10 text-red-600 dark:text-red-400",
  switch: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  rightsize: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  keep: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export function ReportDashboard({
  encodedData,
  reportId,
}: {
  encodedData?: string;
  reportId?: string;
}) {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (reportId) {
        const data = await getReport(reportId);
        if (data) {
          setResult(data.result);
          generateAiSummary(data.result).then(setSummary);
          return;
        }
      }

      if (encodedData) {
        try {
          const data: AuditContext = JSON.parse(atob(encodedData));
          const res = runAudit(data);
          setResult(res);
          generateAiSummary(res).then(setSummary);
        } catch (e) {
          console.error("Failed to parse audit data", e);
        }
      }
    }
    loadData();
  }, [encodedData, reportId]);

  if ((!encodedData && !reportId) || !result) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Invalid or Missing Data</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't generate a report from the provided link.
        </p>
        <Link href="/audit">
          <Button>Start New Audit</Button>
        </Link>
      </div>
    );
  }

  const handleLeadCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsCapturing(true);
    const success = await captureLead(email, reportId);
    if (success) {
      setLeadCaptured(true);
    }
    setIsCapturing(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const savingsPercent =
    result.totalCurrentSpend > 0
      ? Math.round((result.monthlySavings / result.totalCurrentSpend) * 100)
      : 0;

  return (
    <div className="container max-w-4xl py-12 md:py-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-3 text-xs font-mono">
            AI Spend Audit
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Your Optimization Report</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Based on self-reported usage · Prices verified{" "}
            <span className="font-medium text-foreground/80">May 2025</span>
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-2 h-9"
          onClick={handleShare}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" /> Link Copied
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5" /> Share Report
            </>
          )}
        </Button>
      </div>

      {/* Topline Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="sm:col-span-1">
          <CardHeader className="pb-1 pt-4 px-5">
            <CardDescription className="text-xs">Current Monthly Spend</CardDescription>
            <CardTitle className="text-2xl font-mono">
              ${result.totalCurrentSpend.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="pt-3 border-t border-border/50 mt-2">
              <p className="text-xs text-muted-foreground mb-0.5">Optimised Spend</p>
              <div className="text-lg font-mono font-semibold">
                ${result.totalOptimizedSpend.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 bg-foreground text-background">
          <CardHeader className="pb-1 pt-5 px-5">
            <CardDescription className="text-background/60 text-xs">
              Identified Annual Savings
            </CardDescription>
            <div className="flex items-baseline gap-3">
              <CardTitle className="text-4xl font-mono">
                ${result.annualSavings.toLocaleString()}
              </CardTitle>
              {savingsPercent > 0 && (
                <span className="text-sm font-mono text-background/70">
                  {savingsPercent}% reduction
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {summary ? (
              <p className="text-background/80 leading-relaxed text-sm mt-2">{summary}</p>
            ) : (
              <div className="flex items-center gap-2 text-background/50 text-sm mt-2">
                <span className="animate-pulse">Generating executive summary…</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Savings Breakdown */}
      {result.savingsBreakdown.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-base font-semibold">Savings Breakdown</h2>
          </div>
          <Card>
            <CardContent className="p-0">
              {result.savingsBreakdown.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <span className="text-sm font-mono font-semibold text-foreground">
                      ${item.amount}/mo
                    </span>
                  </div>
                  {i < result.savingsBreakdown.length - 1 && (
                    <Separator className="mx-5 w-auto" />
                  )}
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between px-5 py-3.5 bg-muted/30">
                <p className="text-sm font-semibold">Total Monthly Savings</p>
                <span className="text-sm font-mono font-bold">
                  ${result.monthlySavings}/mo · ${result.annualSavings.toLocaleString()}/yr
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recommendations */}
      <div>
        <h2 className="text-base font-semibold mb-4">Actionable Recommendations</h2>
        <div className="space-y-3">
          {result.recommendations.map((rec) => (
            <Card
              key={rec.id}
              className={`${
                rec.type === "keep"
                  ? "border-border/40 opacity-70"
                  : "border-border shadow-sm"
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      {rec.type === "keep" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="font-semibold text-sm">{rec.tool}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            REC_COLORS[rec.type]
                          }`}
                        >
                          {REC_LABELS[rec.type]}
                        </span>
                        {rec.newPlan && rec.newPlan !== "None" && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            → <span className="font-medium text-foreground">{rec.newPlan}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {rec.reasoning}
                      </p>
                    </div>
                  </div>
                  {rec.monthlySavings > 0 && (
                    <div className="text-right shrink-0">
                      <div className="text-sm font-mono font-bold text-foreground">
                        ${rec.monthlySavings}/mo
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        ${rec.monthlySavings * 12}/yr
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Lead Capture */}
      {result.annualSavings > 500 && !leadCaptured && (
        <Card className="border-foreground/20 bg-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-4 w-4" />
              Want a step-by-step execution plan?
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              We'll send you a vendor renegotiation guide, procurement email templates, and
              migration checklists — specific to these recommendations. Takes 2 minutes to
              implement the first saving.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLeadCapture} className="flex gap-2 max-w-md">
              <Input
                type="email"
                placeholder="cto@yourcompany.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background h-9 text-sm"
                id="lead-email"
              />
              <Button type="submit" size="sm" disabled={isCapturing} className="shrink-0">
                {isCapturing ? "Sending…" : "Get Plan"}
                {!isCapturing && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              No spam. No sales calls unless you ask. Unsubscribe in one click.
            </p>
          </CardContent>
        </Card>
      )}

      {leadCaptured && (
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Check your inbox
            </CardTitle>
            <CardDescription>
              We've sent the execution plan to <strong>{email}</strong>. If you'd like help
              implementing it, reply to that email — our optimization team responds within 24
              hours.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Footer actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-border/50">
        <Link href="/audit">
          <Button variant="outline" size="sm" className="text-sm">
            Run Another Audit
          </Button>
        </Link>
        <Button variant="ghost" size="sm" className="text-sm gap-2" onClick={handleShare}>
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied!
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5" /> Copy shareable link
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground sm:ml-auto">
          Pricing data last verified: May 2025 ·{" "}
          <a
            href="/docs/PRICING_DATA.md"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Sources
          </a>
        </p>
      </div>
    </div>
  );
}
