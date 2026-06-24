import { Card } from "@/components/ui/card";

export default function RegistryCard({
  txHash,
}: {
  txHash: string;
}) {

  return (

    <Card className="p-6">

      <h2 className="text-xl font-bold mb-4">
        On-Chain Registry
      </h2>

      <div className="break-all">

        {txHash}

      </div>

      <a
        href={`https://hashkey.blockscout.com/tx/${txHash}`}
        target="_blank"
        className="underline mt-4 block"
      >

        View On Explorer

      </a>

    </Card>
  );
}