// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title FinancialIdentityRegistry
 * @notice Permanent registry of unified ecosystem identities.
 *         Associates wallets with dynamic trust, credit, and reliability metrics.
 */
contract FinancialIdentityRegistry is AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant IDENTITY_UPDATER_ROLE = keccak256("IDENTITY_UPDATER_ROLE");

    struct FinancialIdentity {
        address wallet;
        uint256 trustScore;
        uint256 creditScore;
        uint256 reliabilityScore;
        uint256 createdAt;
        uint256 updatedAt;
    }

    mapping(address => FinancialIdentity) private _identities;

    event IdentityCreated(
        address indexed wallet,
        uint256 trustScore,
        uint256 creditScore,
        uint256 reliabilityScore
    );
    
    event IdentityUpdated(
        address indexed wallet,
        uint256 trustScore,
        uint256 creditScore,
        uint256 reliabilityScore
    );

    constructor(address admin) {
        require(admin != address(0), "Invalid admin address");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(IDENTITY_UPDATER_ROLE, admin);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @notice Register a new financial identity.
     */
    function registerIdentity(
        address wallet,
        uint256 trustScore,
        uint256 creditScore,
        uint256 reliabilityScore
    ) external onlyRole(IDENTITY_UPDATER_ROLE) whenNotPaused nonReentrant {
        require(wallet != address(0), "Invalid wallet address");
        require(_identities[wallet].createdAt == 0, "Identity already registered");

        _identities[wallet] = FinancialIdentity({
            wallet: wallet,
            trustScore: trustScore,
            creditScore: creditScore,
            reliabilityScore: reliabilityScore,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        emit IdentityCreated(wallet, trustScore, creditScore, reliabilityScore);
    }

    /**
     * @notice Update an existing identity, or auto-registers if missing.
     */
    function updateIdentity(
        address wallet,
        uint256 trustScore,
        uint256 creditScore,
        uint256 reliabilityScore
    ) external onlyRole(IDENTITY_UPDATER_ROLE) whenNotPaused nonReentrant {
        require(wallet != address(0), "Invalid wallet address");
        
        if (_identities[wallet].createdAt == 0) {
            _identities[wallet] = FinancialIdentity({
                wallet: wallet,
                trustScore: trustScore,
                creditScore: creditScore,
                reliabilityScore: reliabilityScore,
                createdAt: block.timestamp,
                updatedAt: block.timestamp
            });
            emit IdentityCreated(wallet, trustScore, creditScore, reliabilityScore);
        } else {
            FinancialIdentity storage identity = _identities[wallet];
            identity.trustScore = trustScore;
            identity.creditScore = creditScore;
            identity.reliabilityScore = reliabilityScore;
            identity.updatedAt = block.timestamp;
            emit IdentityUpdated(wallet, trustScore, creditScore, reliabilityScore);
        }
    }

    /**
     * @notice Retrieve an active financial identity.
     */
    function getIdentity(address wallet) external view returns (FinancialIdentity memory) {
        require(wallet != address(0), "Invalid wallet address");
        return _identities[wallet];
    }

    /**
     * @notice Check if a wallet has a registered identity.
     */
    function verifyIdentity(address wallet) external view returns (bool) {
        return _identities[wallet].createdAt > 0;
    }
}
