"use client";

export default function DevelopersPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020713",
        color: "#E2E8F0",
        fontFamily: "Inter, sans-serif",
        padding: "80px 24px 100px",
      }}
    >
      <div style={{ maxWidth: 850, margin: "0 auto" }}>
        
        {/* Top Header */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 10,
              color: "#C084FC",
              letterSpacing: 2,
              textTransform: "uppercase",
              background: "rgba(192, 132, 252, 0.08)",
              border: "1px solid rgba(192, 132, 252, 0.2)",
              borderRadius: 30,
              padding: "6px 16px",
              marginBottom: 16,
            }}
          >
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#C084FC" }}></span>
            Developer Hub
          </div>
          <h1
            style={{
              fontSize: 34,
              fontWeight: 900,
              background: "linear-gradient(135deg, #FFFFFF 30%, #94A3B8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -1.5,
              margin: "0 0 12px 0",
            }}
          >
            Integrate Credence in 5 minutes
          </h1>
          <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>
            Connect to our trust identity protocol using the `@credence/sdk` for Node/Ethers.
          </p>
        </div>

        {/* Installation */}
        <div
          style={{
            background: "rgba(10, 18, 30, 0.4)",
            border: "1px solid #111C2E",
            borderRadius: 16,
            padding: 24,
            marginBottom: 32,
          }}
        >
          <h3 style={{ margin: "0 0 12px 0", fontSize: 15, fontWeight: 800 }}>1. Installation</h3>
          <pre
            style={{
              background: "#080E1A",
              border: "1px solid #1A2E4C",
              borderRadius: 8,
              padding: 16,
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 13,
              color: "#34D399",
              margin: 0,
            }}
          >
            npm install @credence/sdk
          </pre>
        </div>

        {/* Integration Code Sample */}
        <div
          style={{
            background: "rgba(10, 18, 30, 0.4)",
            border: "1px solid #111C2E",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <h3 style={{ margin: "0 0 12px 0", fontSize: 15, fontWeight: 800 }}>2. Query Trust Credentials</h3>
          <pre
            style={{
              background: "#080E1A",
              border: "1px solid #1A2E4C",
              borderRadius: 8,
              padding: 20,
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 13,
              color: "#94A3B8",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            <span style={{ color: "#F472B6" }}>import</span> Credence <span style={{ color: "#F472B6" }}>from</span> <span style={{ color: "#34D399" }}>"@credence/sdk"</span>;<br />
            <br />
            <span style={{ color: "#64748B" }}>// Initialize and request credit rating verification</span><br />
            <span style={{ color: "#F472B6" }}>const</span> trust = <span style={{ color: "#F472B6" }}>await</span> Credence.<span style={{ color: "#60A5FA" }}>verify</span>(wallet);<br />
            <br />
            <span style={{ color: "#F472B6" }}>if</span> (trust.<span style={{ color: "#60A5FA" }}>approved</span>) &#123;<br />
            &nbsp;&nbsp;<span style={{ color: "#60A5FA" }}>enableFinance</span>();<br />
            &#125;
          </pre>
        </div>

      </div>
    </main>
  );
}
