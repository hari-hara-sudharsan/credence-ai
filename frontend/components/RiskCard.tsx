import { Card } from "@/components/ui/card";

export default function RiskCard({
  probability,
}: {
  probability: number;
}) {

  return (

    <Card className="p-6">

      <h2 className="text-xl font-bold">
        Default Probability
      </h2>

      <div className="mt-6 text-6xl font-bold text-red-500">

        {probability}%

      </div>

    </Card>
  );
}