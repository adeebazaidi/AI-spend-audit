"use client";

import { useEffect, useState } from "react";
import { runAudit, AuditResult, AuditContext } from "@/lib/audit-engine";
import { generateAiSummary } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, TrendingDown, ArrowRight, Share2, Mail, Zap } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export function ReportDashboard({ encodedData }: { encodedData?: string }) {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [summary, setSummary] = useState<string>("Analyzing your infrastructure...");
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!encodedData) return;
    try {
      const data: AuditContext = JSON.parse(atob(encodedData));
      const res = runAudit(data);
      setResult(res);

      // Fetch AI summary
      generateAiSummary(res).then(setSummary);
    } catch (e) {
      console.error("Failed to parse audit data", e);
    }
  }, [encodedData]);

  if (!encodedData || !result) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Invalid or Missing Data</h2>
        <p className="text-muted-foreground mb-6">We couldn't generate a report from the provided link.</p>
        <Link href="/audit">
          <Button>Start New Audit</Button>
        </Link>
      </div>
    );
  }

  const handleLeadCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // In a real MVP, send to Supabase here
    setLeadCaptured(true);
  };

  return (
    <div className="container max-w-5xl py-12 md:py-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-2">AI Spend Audit</Badge>
          <h1 className="text-3xl font-bold tracking-tight">Your Optimization Report</h1>
          <p className="text-muted-foreground mt-1">Generated based on your self-reported usage.</p>
        </div>
        <Button variant="outline" className="shrink-0 gap-2">
          <Share2 className="h-4 w-4" />
          Share Public Link
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Topline Metrics */}
        <Card className="md:col-span-1 bg-card">
          <CardHeader className="pb-2">
            <CardDescription>Current Monthly Spend</CardDescription>
            <CardTitle className="text-3xl font-mono">${result.totalCurrentSpend.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-4 pt-4 border-t border-border/50">
              <CardDescription>Optimized Spend</CardDescription>
              <div className="text-xl font-mono font-medium">${result.totalOptimizedSpend.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardDescription className="text-primary-foreground/80">Identified Annual Savings</CardDescription>
            <CardTitle className="text-5xl font-mono flex items-center gap-2">
              <TrendingDown className="h-10 w-10 opacity-80" />
              ${result.annualSavings.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-primary-foreground/90 leading-relaxed mt-2 text-lg">
              {summary}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight mt-8">Actionable Insights</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {result.recommendations.map((rec) => (
            <Card key={rec.id} className={rec.type === "keep" ? "border-muted" : "border-border shadow-sm"}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {rec.type === "keep" ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    )}
                    <CardTitle className="text-lg">{rec.tool}</CardTitle>
                  </div>
                  {rec.monthlySavings > 0 && (
                    <Badge variant="secondary" className="font-mono bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400">
                      Save ${rec.monthlySavings}/mo
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                {rec.newPlan && rec.newPlan !== "None" && (
                  <div className="mt-4 flex items-center text-sm font-medium">
                    <span className="text-muted-foreground mr-2">Recommendation:</span>
                    Migrate to {rec.newPlan}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Lead Capture */}
      {result.annualSavings > 500 && !leadCaptured && (
        <Card className="mt-12 border-primary/20 shadow-md bg-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Need help executing this migration?
            </CardTitle>
            <CardDescription className="text-base">
              Enter your work email to get a step-by-step PDF execution guide and a free 15-minute consultation with our optimization team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLeadCapture} className="flex gap-2 max-w-md">
              <Input 
                type="email" 
                placeholder="cto@startup.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background"
              />
              <Button type="submit">
                Get Execution Plan <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {leadCaptured && (
        <Card className="mt-12 border-emerald-500/20 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
              Check your inbox
            </CardTitle>
            <CardDescription>
              We've sent the execution plan to {email}. One of our optimization engineers will be in touch shortly.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
