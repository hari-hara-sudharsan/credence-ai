import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

describe("EIP-712 Signature & Replay Protection Tests", function () {
    async function deployVerifierFixture() {
        const [admin, signer, entity] = await ethers.getSigners();
        const TrustVerifier = await ethers.getContractFactory("TrustVerifier");
        const verifier = await TrustVerifier.deploy();
        return { admin, signer, entity, verifier };
    }

    it("should verify correct signatures matching parameters and reject replays", async function () {
        const { signer, entity, verifier } = await networkHelpers.loadFixture(deployVerifierFixture);
        
        const trustScore = 850n;
        const nonce = 42n;
        const expiry = BigInt(Math.floor(Date.now() / 1000) + 3600);
        
        const domain = {
            name: "Credence Trust",
            version: "1",
            chainId: 177n,
            verifyingContract: await verifier.getAddress(),
        };

        const types = {
            TrustData: [
                { name: "entity", type: "address" },
                { name: "trustScore", type: "uint256" },
                { name: "nonce", type: "uint256" },
                { name: "expiry", type: "uint256" },
            ],
        };

        const value = {
            entity: entity.address,
            trustScore: trustScore,
            nonce: nonce,
            expiry: expiry,
        };

        const signature = await signer.signTypedData(domain, types, value);

        // Let's verify standard signature matches expected signer
        await verifier.verifyTrustSignature(
            entity.address,
            trustScore,
            nonce,
            expiry,
            signature,
            signer.address
        );
        expect(await verifier.isNonceUsed(entity.address, nonce)).to.be.true;

        // Replay of same nonce must fail
        await expect(verifier.verifyTrustSignature(
            entity.address,
            trustScore,
            nonce,
            expiry,
            signature,
            signer.address
        )).to.be.revertedWith("Replay attack detected: nonce already used");
    });

    it("should reject signatures that have passed their expiration windows", async function () {
        const { signer, entity, verifier } = await networkHelpers.loadFixture(deployVerifierFixture);
        
        const trustScore = 850n;
        const nonce = 99n;
        const expiry = BigInt(Math.floor(Date.now() / 1000) - 100); // already expired
        
        const dummySignature = "0x" + "00".repeat(65);

        await expect(verifier.verifyTrustSignature(
            entity.address,
            trustScore,
            nonce,
            expiry,
            dummySignature,
            signer.address
        )).to.be.revertedWith("Signature has expired");
    });
});
