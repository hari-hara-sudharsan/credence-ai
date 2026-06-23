import { Card } from "@/components/ui/card";

interface Props {
  lending: any;
}

export default function LendingCard({
  lending,
}: Props) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Lending Decision
      </h2>

      <p>
        Eligible:{" "}
        {String(lending.eligible)}
      </p>

      <p>
        Interest Rate:{" "}
        {lending.interest_rate}%
      </p>

      <p>
        Collateral Ratio:{" "}
        {lending.collateral_ratio}%
      </p>

      <p>
        Risk Level:{" "}
        {lending.risk_level}
      </p>
    </Card>
  );
}