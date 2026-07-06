import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("Counter", function () {
  it("Should emit the Increment event when calling the inc() function", async function () {
    const counter = await ethers.deployContract("Counter");

    await expect(counter.inc()).to.emit(counter, "Increment").withArgs(1n);
  });

  it("The sum of the Increment events should match the current value", async function () {
    const counter = await ethers.deployContract("Counter");
    const deploymentBlockNumber = await ethers.provider.getBlockNumber();

    // run a series of increments
    for (let i = 1; i <= 10; i++) {
      await counter.incBy(i);
    }

    const events = await counter.queryFilter(
      counter.filters.Increment(),
      deploymentBlockNumber,
      "latest",
    );

    // check that the aggregated events match the current value
    let total = 0n;
    for (const event of events) {
      total += event.args.by;
    }

    expect(await counter.x()).to.equal(total);
  });
});

describe("LoanManager", function () {
  it("Should create, retrieve, activate, and repay a loan", async function () {
    const loanManager = await ethers.deployContract("LoanManager");
    const [borrower] = await ethers.getSigners();

    const loanId = "loan-123";
    const approvedAmount = ethers.parseEther("10");
    const interestRate = 5n; // 5%
    const collateralRatio = 150n; // 150%
    const duration = 30n * 24n * 60n * 60n; // 30 days in seconds
    const offerHash = ethers.zeroPadValue(ethers.toBeArray(0x1234), 32);
    const offerId = "offer-123";

    // 1. Create Loan
    await expect(
      loanManager.createLoan(
        loanId,
        borrower.address,
        approvedAmount,
        interestRate,
        collateralRatio,
        duration,
        offerHash,
        offerId
      )
    )
      .to.emit(loanManager, "LoanCreated")
      .withArgs(loanId, borrower.address, approvedAmount);

    // 2. Read Loan and check fields
    const loan = await loanManager.getLoan(loanId);
    expect(loan[0]).to.equal(loanId);
    expect(loan[1]).to.equal(borrower.address);
    expect(loan[2]).to.equal(approvedAmount);
    expect(loan[3]).to.equal(interestRate);
    expect(loan[4]).to.equal(collateralRatio);
    expect(loan[5]).to.equal(duration);
    expect(loan[8]).to.equal(0n); // PENDING status (enum status is 0)
    expect(loan[9]).to.equal(ethers.hexlify(offerHash));
    expect(loan[10]).to.equal(offerId);

    // 3. Get borrower loans
    const borrowerLoans = await loanManager.getBorrowerLoans(borrower.address);
    expect(borrowerLoans.length).to.equal(1);
    expect(borrowerLoans[0]).to.equal(loanId);

    // 4. Activate Loan
    await expect(loanManager.activateLoan(loanId))
      .to.emit(loanManager, "LoanActivated");

    const activatedLoan = await loanManager.getLoan(loanId);
    expect(activatedLoan[8]).to.equal(1n); // ACTIVE status (enum status is 1)
    expect(activatedLoan[7]).to.be.gt(0n); // Due date is set

    // 5. Repay Loan
    await expect(loanManager.repayLoan(loanId))
      .to.emit(loanManager, "LoanRepaid")
      .withArgs(loanId);

    const repaidLoan = await loanManager.getLoan(loanId);
    expect(repaidLoan[8]).to.equal(2n); // REPAID status (enum status is 2)
  });

  it("Should allow cancelling a pending loan", async function () {
    const loanManager = await ethers.deployContract("LoanManager");
    const [borrower] = await ethers.getSigners();

    const loanId = "loan-456";
    const approvedAmount = ethers.parseEther("5");
    const interestRate = 8n;
    const collateralRatio = 120n;
    const duration = 15n * 24n * 60n * 60n; // 15 days
    const offerHash = ethers.zeroPadValue(ethers.toBeArray(0x5678), 32);
    const offerId = "offer-456";

    await loanManager.createLoan(
      loanId,
      borrower.address,
      approvedAmount,
      interestRate,
      collateralRatio,
      duration,
      offerHash,
      offerId
    );

    // Cancel Loan
    await expect(loanManager.cancelLoan(loanId))
      .to.emit(loanManager, "LoanCancelled")
      .withArgs(loanId);

    const cancelledLoan = await loanManager.getLoan(loanId);
    expect(cancelledLoan[8]).to.equal(3n); // CANCELLED status (enum status is 3)
  });

  it("Should enforce business rules: reject zero loan amount", async function () {
    const loanManager = await ethers.deployContract("LoanManager");
    const [borrower] = await ethers.getSigners();
    const offerHash = ethers.zeroPadValue(ethers.toBeArray(0x1234), 32);

    await expect(
      loanManager.createLoan(
        "loan-fail-1",
        borrower.address,
        0n, // Zero amount
        5n,
        150n,
        30n * 24n * 60n * 60n,
        offerHash,
        "offer-fail-1"
      )
    ).to.be.revertedWith("Loan amount must be positive");
  });

  it("Should enforce business rules: reject duration exceeding limit", async function () {
    const loanManager = await ethers.deployContract("LoanManager");
    const [borrower] = await ethers.getSigners();
    const offerHash = ethers.zeroPadValue(ethers.toBeArray(0x1234), 32);

    await expect(
      loanManager.createLoan(
        "loan-fail-2",
        borrower.address,
        ethers.parseEther("1"),
        5n,
        150n,
        366n * 24n * 60n * 60n, // 366 days (exceeds limit)
        offerHash,
        "offer-fail-2"
      )
    ).to.be.revertedWith("Duration exceeds maximum limit");
  });

  it("Should enforce business rules: reject collateral ratio outside bounds", async function () {
    const loanManager = await ethers.deployContract("LoanManager");
    const [borrower] = await ethers.getSigners();
    const offerHash = ethers.zeroPadValue(ethers.toBeArray(0x1234), 32);

    await expect(
      loanManager.createLoan(
        "loan-fail-3",
        borrower.address,
        ethers.parseEther("1"),
        5n,
        99n, // Under 100%
        30n * 24n * 60n * 60n,
        offerHash,
        "offer-fail-3"
      )
    ).to.be.revertedWith("Collateral ratio outside bounds");

    await expect(
      loanManager.createLoan(
        "loan-fail-4",
        borrower.address,
        ethers.parseEther("1"),
        5n,
        301n, // Over 300%
        30n * 24n * 60n * 60n,
        offerHash,
        "offer-fail-4"
      )
    ).to.be.revertedWith("Collateral ratio outside bounds");
  });
});

describe("SignatureVerifier", function () {
  it("Should successfully verify an EIP-712 signature from the Oracle", async function () {
    const loanManager = await ethers.deployContract("LoanManager");
    const loanManagerAddress = await loanManager.getAddress();
    const verifier = await ethers.deployContract("SignatureVerifier", [loanManagerAddress]);

    const [oracle, borrower] = await ethers.getSigners();

    const offerHash = ethers.zeroPadValue(ethers.toBeArray(0x1234), 32);
    const approvedAmount = ethers.parseEther("10");
    const interestRate = 5n;
    const collateralRatio = 150n;
    const duration = 30n * 24n * 60n * 60n;
    const expiry = BigInt(Math.floor(Date.now() / 1000) + 3600);

    const domain = {
      name: "Credence AI",
      version: "1",
      chainId: 133n,
      verifyingContract: loanManagerAddress,
    };

    const types = {
      UnderwritingOffer: [
        { name: "wallet", type: "address" },
        { name: "offerHash", type: "bytes32" },
        { name: "creditScore", type: "uint256" },
        { name: "approvedAmount", type: "uint256" },
        { name: "interestRate", type: "uint256" },
        { name: "collateralRatio", type: "uint256" },
        { name: "duration", type: "uint256" },
        { name: "expiry", type: "uint256" },
      ],
    };

    const value = {
      wallet: borrower.address,
      offerHash: offerHash,
      creditScore: 750n,
      approvedAmount: approvedAmount,
      interestRate: interestRate,
      collateralRatio: collateralRatio,
      duration: duration,
      expiry: expiry,
    };

    const signature = await oracle.signTypedData(domain, types, value);

    const solOffer = {
      wallet: borrower.address,
      offerHash: offerHash,
      creditScore: 750n,
      approvedAmount: approvedAmount,
      interestRate: interestRate,
      collateralRatio: collateralRatio,
      duration: duration,
      expiry: expiry,
    };

    const isValid = await verifier.verifyOffer(solOffer, signature, oracle.address);
    expect(isValid).to.be.true;

    const isInvalid = await verifier.verifyOffer(solOffer, signature, borrower.address);
    expect(isInvalid).to.be.false;
  });
});

describe("OracleRegistry", function () {
  it("Should successfully publish, verify, and revoke attestations with consensus", async function () {
    const [governor, oracle1, oracle2, relayer, borrower] = await ethers.getSigners();
    const initialOracles = [oracle1.address, oracle2.address];
    const initialThreshold = 2n;

    // 1. Deploy
    const registry = await ethers.deployContract("OracleRegistry", [initialOracles, initialThreshold]);

    const attestationHash = ethers.keccak256(ethers.toUtf8Bytes("attestation-proof-1"));
    const offerHash = ethers.keccak256(ethers.toUtf8Bytes("offer-1"));
    const expiry = BigInt(Math.floor(Date.now() / 1000) + 3600);

    // 2. Generate Oracle Signatures
    const sig1 = await oracle1.signMessage(ethers.toBeArray(attestationHash));
    const sig2 = await oracle2.signMessage(ethers.toBeArray(attestationHash));

    // 3. Try to publish with 1 signature (should fail threshold checks)
    await expect(
      registry.connect(relayer).publishAttestation(attestationHash, offerHash, borrower.address, expiry, [sig1])
    ).to.be.revertedWith("Insufficient signatures for threshold");

    // 4. Publish with 2 signatures (consensus met)
    await expect(
      registry.connect(relayer).publishAttestation(attestationHash, offerHash, borrower.address, expiry, [sig1, sig2])
    )
      .to.emit(registry, "AttestationPublished")
      .withArgs(attestationHash, offerHash, borrower.address, relayer.address);

    // 5. Verify status
    const record = await registry.verifyAttestation(attestationHash);
    expect(record[0]).to.be.true; // exists
    expect(record[1]).to.be.true; // verified
    expect(record[2]).to.be.false; // revoked
    expect(record[3]).to.be.false; // expired
    expect(record[4]).to.equal(relayer.address); // oracle relayer

    // 6. Test Revocation consensus
    const innerMsg = ethers.solidityPackedKeccak256(["string", "bytes32"], ["REVOKE:", attestationHash]);
    const revSig1 = await oracle1.signMessage(ethers.toBeArray(innerMsg));
    const revSig2 = await oracle2.signMessage(ethers.toBeArray(innerMsg));

    // Revoke attestation
    await expect(
      registry.connect(relayer).revokeAttestation(attestationHash, [revSig1, revSig2])
    )
      .to.emit(registry, "AttestationRevoked")
      .withArgs(attestationHash);

    // Verify revoked status
    const updatedRecord = await registry.verifyAttestation(attestationHash);
    expect(updatedRecord[1]).to.be.false; // verified should now be false
    expect(updatedRecord[2]).to.be.true; // revoked should now be true
  });
});

describe("CreditPassportV2", function () {
  it("Should successfully mint, verify, refresh, and revoke verifiable credentials on-chain", async function () {
    const [owner, wallet] = await ethers.getSigners();
    const registry = await ethers.deployContract("CreditPassportV2");

    const passportHash = ethers.keccak256(ethers.toUtf8Bytes("passport-v2-hash-1"));
    const attestationHash = ethers.keccak256(ethers.toUtf8Bytes("attestation-1"));
    const metadataURI = "/passport/v2/credential";
    const expiresAt = BigInt(Math.floor(Date.now() / 1000) + 3600);

    // 1. Mint Passport
    await expect(
      registry.mintPassport(passportHash, attestationHash, wallet.address, metadataURI, expiresAt, "HUMAN", 800n, "PRIME")
    )
      .to.emit(registry, "PassportMinted")
      .withArgs(passportHash, wallet.address, 0n);

    // 2. Verify
    const check1 = await registry.verifyPassport(passportHash);
    expect(check1[0]).to.be.true; // exists
    expect(check1[1]).to.be.true; // verified
    expect(check1[2]).to.be.false; // revoked
    expect(check1[3]).to.be.false; // expired
    expect(check1[4]).to.equal(metadataURI);

    // 3. Refresh
    const newPassportHash = ethers.keccak256(ethers.toUtf8Bytes("passport-v2-hash-2"));
    const newMetadataURI = "/passport/v2/credential/new";
    const newExpiresAt = BigInt(Math.floor(Date.now() / 1000) + 7200);

    await expect(
      registry.refreshPassport(passportHash, newPassportHash, newMetadataURI, newExpiresAt, "HUMAN", 850n, "PRIME")
    )
      .to.emit(registry, "PassportRefreshed")
      .withArgs(passportHash, newPassportHash, wallet.address);

    // Verify old is deactivated/revoked
    const checkOld = await registry.verifyPassport(passportHash);
    expect(checkOld[1]).to.be.false; // verified is false
    expect(checkOld[2]).to.be.true; // revoked is true

    // Verify new is active
    const checkNew = await registry.verifyPassport(newPassportHash);
    expect(checkNew[0]).to.be.true; // exists
    expect(checkNew[1]).to.be.true; // verified
    expect(checkNew[2]).to.be.false; // revoked
    expect(checkNew[4]).to.equal(newMetadataURI);

    // 4. Revoke
    await expect(registry.revokePassport(newPassportHash))
      .to.emit(registry, "PassportRevoked")
      .withArgs(newPassportHash);

    const checkRevoked = await registry.verifyPassport(newPassportHash);
    expect(checkRevoked[1]).to.be.false; // verified is false
    expect(checkRevoked[2]).to.be.true; // revoked is true
  });
});

describe("VerificationRegistry", function () {
  it("Should successfully publish, verify, and retrieve verification proofs on UCVN on-chain registry", async function () {
    const [owner, wallet] = await ethers.getSigners();
    const registry = await ethers.deployContract("VerificationRegistry");

    const verificationHash = ethers.keccak256(ethers.toUtf8Bytes("verification-hash-1"));
    const passportHash = ethers.keccak256(ethers.toUtf8Bytes("passport-hash-1"));
    const attestationHash = ethers.keccak256(ethers.toUtf8Bytes("attestation-hash-1"));

    // 1. Publish Verification
    await expect(
      registry.publishVerification(verificationHash, passportHash, attestationHash, wallet.address)
    )
      .to.emit(registry, "VerificationPublished")
      .withArgs(verificationHash, passportHash, attestationHash, wallet.address, anyValue => true);

    // 2. Verify
    const check = await registry.verify(verificationHash);
    expect(check[0]).to.be.true; // exists
    expect(check[1]).to.equal(wallet.address);
    expect(check[2]).to.be.greaterThan(0n); // timestamp

    // 3. Get Verification Record
    const record = await registry.getVerification(verificationHash);
    expect(record.verificationHash).to.equal(verificationHash);
    expect(record.passportHash).to.equal(passportHash);
    expect(record.attestationHash).to.equal(attestationHash);
    expect(record.wallet).to.equal(wallet.address);
  });
});





