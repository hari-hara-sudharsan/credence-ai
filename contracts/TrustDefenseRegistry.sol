// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title TrustDefenseRegistry
 * @notice Stores verified authenticity scores and security assessments for Credence AI wallets.
 */
contract TrustDefenseRegistry is AccessControl, Pausable {
    bytes32 public constant SECURITY_ORACLE_ROLE = keccak256("SECURITY_ORACLE_ROLE");

    struct DefenseRecord {
        address wallet;
        uint256 authenticityScore;
        uint256 riskScore;
        bytes32 proofHash;
        uint256 timestamp;
    }

    mapping(address => DefenseRecord) private _records;

    event DefenseCheckCompleted(address indexed wallet, uint256 authenticityScore, uint256 riskScore);
    event RiskDetected(address indexed wallet, string threatType, uint256 severity);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(SECURITY_ORACLE_ROLE, admin);
    }

    /**
     * @notice Record a new security assessment check for a wallet.
     */
    function recordDefenseCheck(
        address wallet,
        uint256 authenticityScore,
        uint256 riskScore,
        bytes32 proofHash
    ) external onlyRole(SECURITY_ORACLE_ROLE) whenNotPaused {
        require(wallet != address(0), "Invalid wallet address");
        require(authenticityScore <= 100, "Authenticity score invalid");
        require(riskScore <= 100, "Risk score invalid");

        _records[wallet] = DefenseRecord({
            wallet: wallet,
            authenticityScore: authenticityScore,
            riskScore: riskScore,
            proofHash: proofHash,
            timestamp: block.timestamp
        });

        emit DefenseCheckCompleted(wallet, authenticityScore, riskScore);

        if (riskScore >= 60) {
            emit RiskDetected(wallet, "SUSPICIOUS_ACTIVITY", riskScore);
        }
    }

    /**
     * @notice Get the security risk profile details of a wallet.
     */
    function getRiskProfile(address wallet) external view returns (
        address recordWallet,
        uint256 authenticityScore,
        uint256 riskScore,
        bytes32 proofHash,
        uint256 timestamp
    ) {
        DefenseRecord storage record = _records[wallet];
        return (
            record.wallet,
            record.authenticityScore,
            record.riskScore,
            record.proofHash,
            record.timestamp
        );
    }

    /**
     * @notice Verify if a wallet is safe to perform trust operations.
     */
    function verifyTrustSafety(address wallet) external view returns (bool) {
        DefenseRecord storage record = _records[wallet];
        if (record.wallet == address(0)) {
            // Unregistered means no warning yet, baseline safe
            return true;
        }
        return record.authenticityScore >= 50 && record.riskScore < 60;
    }

    /**
     * @notice Pauses registration of security updates.
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice Unpauses registration of security updates.
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
