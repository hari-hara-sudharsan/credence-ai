// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title TrustMarketplace
 * @notice On-chain registry of verified consumer protocols using Credence AI trust network.
 */
contract TrustMarketplace is AccessControl, Pausable {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    struct Protocol {
        address protocolAddress;
        string category;
        bool verified;
        uint256 joinedAt;
    }

    mapping(address => Protocol) public protocols;
    address[] public protocolAddresses;

    // Track usage records: entity => action type => usage count
    mapping(address => mapping(string => uint256)) public usageRecords;

    event ProtocolRegistered(address indexed protocolAddress, string category);
    event ProtocolVerified(address indexed protocolAddress, bool verified);
    event TrustRequested(address indexed protocolAddress, address indexed entity, bytes32 attestationHash);
    event TrustDelivered(address indexed protocolAddress, address indexed entity, bytes32 attestationHash, bool success);
    event UsageRecorded(address indexed entity, string actionType, uint256 newCount);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(VERIFIER_ROLE, admin);
    }

    /**
     * @notice Allows external consumer protocols to register in the marketplace
     */
    function registerProtocol(string calldata category) external whenNotPaused {
        require(protocols[msg.sender].protocolAddress == address(0), "Protocol already registered");

        protocols[msg.sender] = Protocol({
            protocolAddress: msg.sender,
            category: category,
            verified: false,
            joinedAt: block.timestamp
        });
        protocolAddresses.push(msg.sender);

        emit ProtocolRegistered(msg.sender, category);
    }

    /**
     * @notice Allows marketplace admins to verify registered protocols
     */
    function verifyProtocol(address protocolAddress, bool verified) external onlyRole(VERIFIER_ROLE) {
        require(protocols[protocolAddress].protocolAddress != address(0), "Protocol not registered");
        protocols[protocolAddress].verified = verified;

        emit ProtocolVerified(protocolAddress, verified);
    }

    /**
     * @notice Allows verified protocols to request on-chain verification of a trust attestation hash
     */
    function requestTrustVerification(address entity, bytes32 attestationHash) external whenNotPaused {
        require(protocols[msg.sender].protocolAddress != address(0), "Caller must be registered protocol");
        require(protocols[msg.sender].verified, "Caller must be verified protocol");

        emit TrustRequested(msg.sender, entity, attestationHash);

        // Deliver verification event immediately
        emit TrustDelivered(msg.sender, entity, attestationHash, true);
    }

    /**
     * @notice Allows protocols to record entity activity or usage history on-chain
     */
    function recordUsage(address entity, string calldata actionType) external whenNotPaused {
        require(protocols[msg.sender].protocolAddress != address(0), "Caller must be registered protocol");
        require(protocols[msg.sender].verified, "Caller must be verified protocol");

        usageRecords[entity][actionType] += 1;

        emit UsageRecorded(entity, actionType, usageRecords[entity][actionType]);
    }

    /**
     * @notice Pauses contract functions
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice Unpauses contract functions
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @notice Returns total number of registered protocols
     */
    function getProtocolCount() external view returns (uint256) {
        return protocolAddresses.length;
    }
}
