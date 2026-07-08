// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract ProofOfTrustRegistry is AccessControl, Pausable {
    bytes32 public constant PROOF_CREATOR_ROLE = keccak256("PROOF_CREATOR_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    struct TrustProof {
        bytes32 proofHash;
        address wallet;
        string proofType;
        uint256 trustImpact;
        uint256 timestamp;
        bool valid;
    }

    mapping(bytes32 => TrustProof) public proofs;
    mapping(address => bytes32[]) public walletProofs;
    mapping(bytes32 => bool) public processedHashes;

    event ProofCreated(address indexed wallet, bytes32 indexed proofHash, string proofType);
    event ProofVerified(bytes32 indexed proofHash);
    event ProofInvalidated(bytes32 indexed proofHash);

    constructor(address defaultAdmin) {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    }

    function createTrustProof(
        bytes32 proofHash,
        address wallet,
        string calldata proofType,
        uint256 trustImpact
    ) external whenNotPaused onlyRole(PROOF_CREATOR_ROLE) {
        require(!processedHashes[proofHash], "Proof already exists");
        require(wallet != address(0), "Invalid wallet");

        proofs[proofHash] = TrustProof({
            proofHash: proofHash,
            wallet: wallet,
            proofType: proofType,
            trustImpact: trustImpact,
            timestamp: block.timestamp,
            valid: false
        });

        walletProofs[wallet].push(proofHash);
        processedHashes[proofHash] = true;

        emit ProofCreated(wallet, proofHash, proofType);
    }

    function verifyTrustProof(
        bytes32 proofHash,
        bytes calldata signature
    ) external whenNotPaused onlyRole(ORACLE_ROLE) {
        require(processedHashes[proofHash], "Proof does not exist");
        require(!proofs[proofHash].valid, "Proof already verified");

        // Simple check: In a full production implementation, the signature 
        // would be EIP712 recovered against the oracle signer here.
        require(signature.length > 0, "Invalid signature");

        proofs[proofHash].valid = true;
        emit ProofVerified(proofHash);
    }

    function invalidateProof(bytes32 proofHash) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(processedHashes[proofHash], "Proof does not exist");
        proofs[proofHash].valid = false;
        emit ProofInvalidated(proofHash);
    }

    function getWalletProofs(address wallet) external view returns (TrustProof[] memory) {
        bytes32[] memory hashList = walletProofs[wallet];
        TrustProof[] memory userProofs = new TrustProof[](hashList.length);
        
        for(uint i = 0; i < hashList.length; i++) {
            userProofs[i] = proofs[hashList[i]];
        }
        
        return userProofs;
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
