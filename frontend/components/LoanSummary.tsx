import { Card, CardContent } from "@/components/ui/card";

interface SummaryData {
  total_loans: number;
  active_loans: number;
  completed_loans: number;
  total_borrowed: number;
  outstanding: number;
}

export default function LoanSummary({ summary }: { summary: SummaryData }) {
  const cards = [
    {
      title: "Total Loans",
      value: summary.total_loans,
      desc: `${summary.completed_loans} completed / ${summary.active_loans} active`,
      icon: (
        <svg
          className="h-5 w-5 text-[#3DDC97]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: "Active Loans",
      value: summary.active_loans,
      desc: "Currently accruing interest",
      icon: (
        <svg
          className="h-5 w-5 text-[#3DDC97]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: "Completed Loans",
      value: summary.completed_loans,
      desc: "Fully settled on-chain",
      icon: (
        <svg
          className="h-5 w-5 text-[#3DDC97]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Outstanding Debt",
      value: `${summary.outstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} HSK`,
      desc: `Out of ${summary.total_borrowed.toLocaleString(undefined, { maximumFractionDigits: 2 })} HSK borrowed`,
      icon: (
        <svg
          className="h-5 w-5 text-[#3DDC97]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="border-[#2A3142] bg-[#1A1F2B]/60 text-[#E8E6DE] transition-all duration-300 hover:border-[#3DDC97]/40 hover:bg-[#1A1F2B]/85 hover:translate-y-[-2px]"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-[0.14em] text-[#6B7280] uppercase">
                {card.title}
              </span>
              {card.icon}
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-3xl font-medium tracking-tight">
                {card.value}
              </span>
            </div>
            <p className="mt-2 font-mono text-[10px] tracking-[0.08em] text-[#6B7280] uppercase">
              {card.desc}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
