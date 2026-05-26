import { ReportDashboard } from "@/components/audit/report-dashboard";
import { Suspense } from "react";

export default async function ResultsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const dataString = params.data as string | undefined;
  const idString = params.id as string | undefined;

  return (
    <div className="min-h-screen bg-muted/30">
      <Suspense fallback={<div className="p-8 text-center">Loading your personalized audit...</div>}>
        <ReportDashboard encodedData={dataString} reportId={idString} />
      </Suspense>
    </div>
  );
}
