// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract GovernanceRegistry {
    struct GovernanceRecord {
        bytes32 actionHash;
        address actor;
        uint256 timestamp;
        string actionType;
    }

    mapping(bytes32 => GovernanceRecord) private records;

    event ActionRecorded(bytes32 indexed actionHash, address indexed actor, string actionType, uint256 timestamp);

    function recordAction(bytes32 actionHash, string calldata actionType) external {
        require(records[actionHash].timestamp == 0, "Action record already registered");

        records[actionHash] = GovernanceRecord({
            actionHash: actionHash,
            actor: msg.sender,
            timestamp: block.timestamp,
            actionType: actionType
        });

        emit ActionRecorded(actionHash, msg.sender, actionType, block.timestamp);
    }

    function getAction(bytes32 actionHash) external view returns (address actor, uint256 timestamp, string memory actionType) {
        GovernanceRecord memory r = records[actionHash];
        require(r.timestamp > 0, "Record does not exist");
        return (r.actor, r.timestamp, r.actionType);
    }

    function verifyAction(bytes32 actionHash, address actor) external view returns (bool) {
        GovernanceRecord memory r = records[actionHash];
        return (r.timestamp > 0 && r.actor == actor);
    }
}
