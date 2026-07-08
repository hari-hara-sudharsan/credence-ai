// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract AIDecisionRegistry is AccessControl, Pausable {
    using ECDSA for bytes32;

    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    struct Decision {
        bytes32 decisionHash;
        address wallet;
        uint256 timestamp;
        address verifier;
        bool valid;
    }

    mapping(bytes32 => Decision) public decisions;
    mapping(address => bytes32[]) public walletDecisions;

    event AIDecisionRegistered(bytes32 indexed decisionHash, address indexed wallet, address verifier);
    event AIDecisionRevoked(bytes32 indexed decisionHash);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Registers a verified AI Decision. Only an authorized oracle can submit.
     */
    function registerDecision(
        bytes32 decisionHash,
        address wallet,
        bytes memory oracleSignature
    ) external whenNotPaused onlyRole(ORACLE_ROLE) {
        require(decisions[decisionHash].timestamp == 0, "Decision already registered");
        
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(decisionHash);
        address signer = ethSignedMessageHash.recover(oracleSignature);
        require(hasRole(ORACLE_ROLE, signer), "Invalid Oracle signature");

        decisions[decisionHash] = Decision({
            decisionHash: decisionHash,
            wallet: wallet,
            timestamp: block.timestamp,
            verifier: signer,
            valid: true
        });

        walletDecisions[wallet].push(decisionHash);
        emit AIDecisionRegistered(decisionHash, wallet, signer);
    }

    /**
     * @dev Checks if a decision is currently valid. Used by LendingManager.
     */
    function verifyDecision(bytes32 decisionHash) external view returns (bool) {
        Decision memory d = decisions[decisionHash];
        require(d.timestamp > 0, "Decision not found");
        // Example logic: Decisions expire after 30 days
        require(block.timestamp <= d.timestamp + 30 days, "Decision expired");
        return d.valid;
    }

    /**
     * @dev Revokes a decision if AI behavior was found manipulative post-factum.
     */
    function revokeDecision(bytes32 decisionHash) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(decisions[decisionHash].timestamp > 0, "Decision not found");
        decisions[decisionHash].valid = false;
        emit AIDecisionRevoked(decisionHash);
    }

    function getWalletDecisions(address wallet) external view returns (bytes32[] memory) {
        return walletDecisions[wallet];
    }
}
