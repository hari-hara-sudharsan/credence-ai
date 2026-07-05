"use client";

import { useState } from "react";

interface CodeExampleProps {
  code: string;
  language: string;
}

export default function CodeExample({ code, language }: CodeExampleProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative border border-[#2A3142] bg-[#0B0E14]/40 rounded-sm overflow-hidden group">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2A3142]/40 bg-[#0B0E14]/65 font-mono text-[9px] text-[#6B7280]">
        <span className="uppercase">{language} Example</span>
        <button
          onClick={handleCopy}
          className="text-[#00E5FF] hover:underline cursor-pointer tracking-wider"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="font-mono text-xs text-[#00E5FF]/90 p-4 overflow-x-auto leading-relaxed max-h-72">
        <code>{code}</code>
      </pre>
    </div>
  );
}
