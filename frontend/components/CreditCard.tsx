import { Card } from "@/components/ui/card";

import ScoreGauge from "./ScoreGauge";

export default function CreditCard({
  score,
  rating,
}: {
  score: number;
  rating: string;
}) {

  return (

    <Card className="p-6">

      <h2 className="text-xl font-bold mb-4">
        Credit Profile
      </h2>

      <ScoreGauge
        score={score}
      />

      <div className="text-center">

        <div className="text-5xl font-bold">
          {score}
        </div>

        <div className="text-lg mt-2">
          {rating}
        </div>

      </div>

    </Card>
  );
}