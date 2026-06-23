import { Card } from "@/components/ui/card";

interface Props {
  report: string;
}

export default function ReportCard({
  report,
}: Props) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">
        AI Credit Report
      </h2>

      <div className="whitespace-pre-wrap">
        {report}
      </div>
    </Card>
  );
}