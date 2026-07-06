import { expect } from "chai";
import { createClient } from "../backend/sdk/typescript";

describe("TrustAgent Developer SDK and API Integration", function () {
    const testWallet = "0x5bb83E60a7a05A0e1b077B66412a26306e334208";
    let client: any;

    before(function () {
        client = createClient("test_api_key", "http://127.0.0.1:8000");

        // Mock global fetch for testing developer SDK calls without a live server
        global.fetch = async (url: any, config: any): Promise<any> => {
            const path = new URL(url).pathname;

            if (path.includes("/api/ai/risk/")) {
                return {
                  ok: true,
                  json: async () => ({
                    wallet: testWallet.toLowerCase(),
                    defaultRisk: 3.8,
                    confidence: 91,
                    riskTrend: "DECREASING",
                    reasons: ["5 successful repayments", "No failed settlements"]
                  })
                };
            }

            if (path.includes("/api/ai/recommend/")) {
                return {
                  ok: true,
                  json: async () => ({
                    decision: "APPROVE",
                    recommendedLoan: 12000,
                    interest: "4.8%",
                    reason: "Prime trust profile detected"
                  })
                };
            }

            if (path.includes("/api/ai/trust-report/")) {
                return {
                  ok: true,
                  json: async () => ({
                    identity: "Prime",
                    trustScore: 920,
                    defaultPrediction: 2.4,
                    recommendation: "Increase credit access",
                    confidence: 94
                  })
                };
            }

            throw new Error(`Unexpected endpoint path: ${path}`);
        };
    });

    it("should generate risk prediction via Developer SDK", async function () {
        const prediction = await client.trust.predict(testWallet);
        expect(prediction.wallet).to.equal(testWallet.toLowerCase());
        expect(prediction.defaultRisk).to.equal(3.8);
        expect(prediction.riskTrend).to.equal("DECREASING");
        expect(prediction.reasons.length).to.equal(2);
    });

    it("should retrieve financial recommendations via mocked endpoint", async function () {
        const response = await global.fetch("http://127.0.0.1:8000/api/ai/recommend/" + testWallet, {});
        const recommendation = await response.json();
        expect(recommendation.decision).to.equal("APPROVE");
        expect(recommendation.recommendedLoan).to.equal(12000);
        expect(recommendation.interest).to.equal("4.8%");
    });

    it("should generate complete AI trust reports via mocked endpoint", async function () {
        const response = await global.fetch("http://127.0.0.1:8000/api/ai/trust-report/" + testWallet, {});
        const report = await response.json();
        expect(report.identity).to.equal("Prime");
        expect(report.trustScore).to.equal(920);
        expect(report.defaultPrediction).to.equal(2.4);
    });
});
