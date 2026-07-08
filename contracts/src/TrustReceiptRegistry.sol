// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TrustReceiptRegistry
 * @notice Permanent verifiable proof layer for financial reputation changes in Credence AI.
 */
contract TrustReceiptRegistry is AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant RECEIPT_ISSUER_ROLE = keccak256("RECEIPT_ISSUER_ROLE");

    struct TrustReceipt {
        uint256 receiptId;
        address entity;
        string actionType;
        int256 trustImpact;
        bytes32 proofHash;
        address issuer;
        uint256 timestamp;
        bool valid;
    }

    uint256 public nextReceiptId = 1;
    
    mapping(uint256 => TrustReceipt) public receipts;
    mapping(address => uint256[]) public entityReceiptIds;

    event TrustReceiptIssued(
        address indexed wallet,
        string action,
        int256 impact,
        bytes32 indexed hash
    );

    event TrustReceiptInvalidated(uint256 indexed receiptId);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(RECEIPT_ISSUER_ROLE, admin);
    }

    /**
     * @notice Issue a new cryptographic trust receipt for a financial action.
     */
    function issueReceipt(
        address entity,
        string calldata actionType,
        int256 trustImpact,
        bytes32 proofHash
    ) external onlyRole(RECEIPT_ISSUER_ROLE) whenNotPaused nonReentrant returns (uint256) {
        require(entity != address(0), "Invalid entity address");
        
        uint256 rid = nextReceiptId;
        nextReceiptId++;

        receipts[rid] = TrustReceipt({
            receiptId: rid,
            entity: entity,
            actionType: actionType,
            trustImpact: trustImpact,
            proofHash: proofHash,
            issuer: msg.sender,
            timestamp: block.timestamp,
            valid: true
        });

        entityReceiptIds[entity].push(rid);

        emit TrustReceiptIssued(entity, actionType, trustImpact, proofHash);
        return rid;
    }

    /**
     * @notice Verify and return key attributes of a trust receipt.
     */
    function verifyReceipt(uint256 id)
        external
        view
        returns (
            address owner,
            string memory action,
            bytes32 proofHash,
            address issuer,
            uint256 timestamp,
            bool validity
        )
    {
        TrustReceipt memory r = receipts[id];
        require(r.receiptId != 0, "Receipt not found");
        return (r.entity, r.actionType, r.proofHash, r.issuer, r.timestamp, r.valid);
    }

    /**
     * @notice Retrieve all receipts for a given wallet address.
     */
    function getEntityReceipts(address wallet) external view returns (TrustReceipt[] memory) {
        uint256[] memory ids = entityReceiptIds[wallet];
        TrustReceipt[] memory result = new TrustReceipt[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = receipts[ids[i]];
        }
        return result;
    }

    /**
     * @notice Invalidate a compromised receipt. Admin only.
     */
    function invalidateReceipt(uint256 id) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(receipts[id].receiptId != 0, "Receipt not found");
        require(receipts[id].valid, "Receipt already invalid");
        
        receipts[id].valid = false;
        
        emit TrustReceiptInvalidated(id);
    }

    // ── Emergency Pausable ──────────────────────────────────────────

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
