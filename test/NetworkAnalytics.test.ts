import { expect } from "chai";
import { analyticsEngine } from "../backend/services/analytics/network_analytics_engine";
import { capitalEngine } from "../backend/services/analytics/capital_metrics_engine";
import { db } from "../backend/database/network_db";

describe("Network Analytics Engine", function () {
  it("should count total identities", function () {
    const identities = analyticsEngine.calculateTotalIdentities();
    expect(identities).to.be.greaterThan(0);
  });

  it("should count trust events", function () {
    const events = analyticsEngine.calculateTrustEvents();
    expect(events).to.be.greaterThan(0);
  });

  it("should calculate settlement volume correctly", function () {
    const volume = analyticsEngine.calculateSettlementVolume();
    expect(volume).to.be.greaterThan(0);
  });

  it("should retrieve recent activity limited correctly", function () {
    const activity = analyticsEngine.getRecentActivity(5);
    expect(activity.length).to.equal(5);
  });
});

describe("Capital Metrics Engine", function () {
  it("should calculate unlocked capital vs traditional DeFi", function () {
    const metrics = capitalEngine.calculateMetrics();
    expect(metrics.traditionalCollateralRequirement).to.equal("150%");
    expect(metrics.credenceCollateralRequirement).to.equal("30%");
    expect(metrics.capitalUnlocked).to.be.greaterThan(0);
  });
});
