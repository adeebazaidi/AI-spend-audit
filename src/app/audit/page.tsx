import { AuditForm } from "@/components/audit/audit-form";

export default function AuditPage() {
  return (
    <div className="container max-w-4xl py-12 md:py-24">
      <div className="mb-10 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Spend Audit</h1>
        <p className="text-muted-foreground text-lg">
          Enter your current AI tooling to discover overspending and optimization opportunities.
        </p>
      </div>
      <AuditForm />
    </div>
  );
}
