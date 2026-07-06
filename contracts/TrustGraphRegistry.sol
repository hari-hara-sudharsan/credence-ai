// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title TrustGraphRegistry
 * @notice On-chain anchor registry for financial trust graph nodes and event edges.
 */
contract TrustGraphRegistry is AccessControl, Pausable {
    bytes32 public constant RECORD_WRITER_ROLE = keccak256("RECORD_WRITER_ROLE");

    struct TrustEvent {
        bytes32 eventHash;
        address entity;
        uint256 timestamp;
        string eventType;
    }

    // Mapping: eventHash => TrustEvent
    mapping(bytes32 => TrustEvent) public trustEvents;
    
    // Mapping: entity => list of event hashes
    mapping(address => bytes32[]) public entityEvents;

    event TrustGraphUpdated(address indexed entity, bytes32 indexed eventHash);
    event TrustEventRecorded(address indexed entity, bytes32 indexed eventHash, string eventType);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(RECORD_WRITER_ROLE, admin);
    }

    /**
     * @notice Records a new trust event to register in the graph, with replay protection
     */
    function recordTrustEvent(
        bytes32 eventHash,
        address entity,
        string calldata eventType
    ) external onlyRole(RECORD_WRITER_ROLE) whenNotPaused {
        require(trustEvents[eventHash].entity == address(0), "Event already recorded");
        require(entity != address(0), "Invalid entity address");

        trustEvents[eventHash] = TrustEvent({
            eventHash: eventHash,
            entity: entity,
            timestamp: block.timestamp,
            eventType: eventType
        });

        entityEvents[entity].push(eventHash);

        emit TrustEventRecorded(entity, eventHash, eventType);
        emit TrustGraphUpdated(entity, eventHash);
    }

    /**
     * @notice Verifies the validation status of a recorded event hash
     */
    function verifyTrustEvent(bytes32 eventHash) external view returns (bool exists, address entity, uint256 timestamp, string memory eventType) {
        TrustEvent memory ev = trustEvents[eventHash];
        if (ev.entity != address(0)) {
            return (true, ev.entity, ev.timestamp, ev.eventType);
        }
        return (false, address(0), 0, "");
    }

    /**
     * @notice Retrieves all event hashes registered for a specific entity wallet
     */
    function getEntityEvents(address entity) external view returns (bytes32[] memory) {
        return entityEvents[entity];
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
}
