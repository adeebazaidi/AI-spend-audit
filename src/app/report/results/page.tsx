import { ReportDashboard } from "@/components/audit/report-dashboard";
import { Suspense } from "react";

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const dataString = params.data as string | undefined;
  const idString = params.id as string | undefined;

  return (
    <div className="bg-muted/10 min-h-[calc(100vh-4rem)]">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="text-center space-y-3">
              <div className="h-6 w-6 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Loading your audit results…</p>
            </div>
          </div>
        }
      >
        <ReportDashboard encodedData={dataString} reportId={idString} />
      </Suspense>
    </div>
  );
}
