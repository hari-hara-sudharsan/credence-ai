import "./globals.css";
import Navbar from "@/components/Navbar";
import { WalletProvider } from "@/context/WalletContext";

export const metadata = {
  title: "Credence AI — On-Chain Credit Intelligence",
  description:
    "AI-powered on-chain credit infrastructure for decentralized finance. Credit scores, lending intelligence, and wallet analysis on HashKey Chain.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
    >

      <body className="min-h-full flex flex-col bg-[#040C1A] text-[#E2E8F0]">
        <WalletProvider>
          <Navbar />
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
