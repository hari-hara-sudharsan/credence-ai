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

    struct ConsumerProtocol {
        address protocol;
        string category;
        uint256 totalRequests;
        bool active;
    }

    mapping(address => Protocol) public protocols;
    address[] public protocolAddresses;

    mapping(address => ConsumerProtocol) public consumerProtocols;

    // Track usage records: entity => action type => usage count
    mapping(address => mapping(string => uint256)) public usageRecords;

    event ProtocolRegistered(address indexed protocolAddress, string category);
    event ProtocolVerified(address indexed protocolAddress, bool verified);
    event TrustRequested(address indexed protocolAddress, address indexed entity, bytes32 attestationHash);
    event TrustDelivered(address indexed protocolAddress, address indexed entity, bytes32 attestationHash, bool success);
    event UsageRecorded(address indexed entity, string actionType, uint256 newCount);
    event TrustConsumed(address indexed protocol, address indexed entity, string category, bytes32 indexed decisionId);
    event ProtocolIntegrated(address indexed protocol, string category);

    bytes32 public constant DOMAIN_TYPEHASH = keccak256(
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );

    bytes32 public constant DECISION_TYPEHASH = keccak256(
        "ProtocolDecision(address wallet,string application,uint256 trustScore,uint256 limit,uint256 timestamp)"
    );

    bytes32 public separator;

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(VERIFIER_ROLE, admin);
        separator = keccak256(
            abi.encode(
                DOMAIN_TYPEHASH,
                keccak256(bytes("Credence AI")),
                keccak256(bytes("1")),
                177, // HashKey Chain Mainnet ID
                address(this)
            )
        );
    }

    /**
     * @notice Verifies standard EIP-712 protocol decision signature against expected oracle verifiers.
     */
    function verifyProtocolDecision(
        address wallet,
        string calldata application,
        uint256 trustScore,
        uint256 limit,
        uint256 timestamp,
        bytes calldata signature
    ) public view returns (bool) {
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                separator,
                keccak256(
                    abi.encode(
                        DECISION_TYPEHASH,
                        wallet,
                        keccak256(bytes(application)),
                        trustScore,
                        limit,
                        timestamp
                    )
                )
            )
        );
        address signer = recoverSigner(digest, signature);
        return hasRole(VERIFIER_ROLE, signer);
    }

    /**
     * @notice Recover the signer address from digest and signature bytes.
     */
    function recoverSigner(bytes32 digest, bytes memory signature) public pure returns (address) {
        if (signature.length != 65) {
            return address(0);
        }
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
        return ecrecover(digest, v, r, s);
    }

    /**
     * @notice Registers a consumer protocol to consume trust decisions
     */
    function registerConsumerProtocol(address protocol, string calldata category) external onlyRole(VERIFIER_ROLE) {
        require(protocol != address(0), "Invalid protocol address");
        consumerProtocols[protocol] = ConsumerProtocol({
            protocol: protocol,
            category: category,
            totalRequests: 0,
            active: true
        });
        emit ProtocolIntegrated(protocol, category);
    }

    /**
     * @notice Request trust decision for a wallet
     */
    function requestTrustDecision(address entity, string calldata category) external whenNotPaused returns (bytes32 decisionId) {
        require(consumerProtocols[msg.sender].active, "Caller must be active consumer protocol");
        consumerProtocols[msg.sender].totalRequests += 1;
        decisionId = keccak256(abi.encodePacked(msg.sender, entity, category, block.timestamp, consumerProtocols[msg.sender].totalRequests));
        emit TrustConsumed(msg.sender, entity, category, decisionId);
    }

    /**
     * @notice Record trust usage metrics
     */
    function recordTrustUsage(address entity, string calldata actionType) external whenNotPaused {
        require(consumerProtocols[msg.sender].active, "Caller must be active consumer protocol");
        usageRecords[entity][actionType] += 1;
        emit UsageRecorded(entity, actionType, usageRecords[entity][actionType]);
    }

    /**
     * @notice Fetch consumer protocol statistics
     */
    function getProtocolStats(address protocol) external view returns (ConsumerProtocol memory) {
        require(consumerProtocols[protocol].protocol != address(0), "Protocol not registered");
        return consumerProtocols[protocol];
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
