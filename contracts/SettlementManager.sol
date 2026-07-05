// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title SettlementManager
 * @notice Separates loan approval from payment execution.
 *         Supports both native ETH and ERC20 (HSP/USDC) settlement.
 *         Provides verifiable proof of every financial transaction.
 */
contract SettlementManager is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant SETTLEMENT_ROLE = keccak256("SETTLEMENT_ROLE");

    enum SettlementType { NATIVE, ERC20 }
    enum SettlementState { CREATED, EXECUTED, VERIFIED, FAILED }

    struct Settlement {
        uint256 settlementId;
        uint256 loanId;
        address borrower;
        address lender;
        uint256 amount;
        SettlementType settlementType;
        SettlementState state;
        bytes32 settlementRef;
        uint256 createdAt;
        uint256 executedAt;
    }

    // Storage
    mapping(uint256 => Settlement) public settlements;
    uint256 public settlementCount;

    // Lending asset for ERC20 mode
    IERC20 public lendingAsset;
    bool public erc20Enabled;

    // Events
    event SettlementCreated(
        uint256 indexed settlementId,
        uint256 indexed loanId,
        address borrower,
        address lender,
        uint256 amount
    );

    event SettlementExecuted(
        uint256 indexed settlementId,
        uint256 indexed loanId,
        address borrower,
        uint256 amount,
        bytes32 settlementRef
    );

    event HSPSettlementCompleted(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        bytes32 settlementRef
    );

    event SettlementVerified(uint256 indexed settlementId, bytes32 settlementRef);
    event SettlementFailed(uint256 indexed settlementId, string reason);
    event LendingAssetUpdated(address indexed token);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SETTLEMENT_ROLE, msg.sender);
    }

    // ── Configuration ────────────────────────────────────────────────

    /**
     * @notice Set the ERC20 lending asset (e.g., HSP or USDC).
     */
    function setLendingAsset(address token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(token != address(0), "Invalid token address");
        lendingAsset = IERC20(token);
        erc20Enabled = true;
        emit LendingAssetUpdated(token);
    }

    // ── Settlement Lifecycle ─────────────────────────────────────────

    /**
     * @notice Create a new settlement record for a loan.
     * @param loanId The loan identifier.
     * @param borrower The borrower receiving funds.
     * @param lender The lender providing funds.
     * @param amount The settlement amount.
     * @return settlementId The ID of the created settlement.
     */
    function createSettlement(
        uint256 loanId,
        address borrower,
        address lender,
        uint256 amount
    )
        external
        onlyRole(SETTLEMENT_ROLE)
        whenNotPaused
        nonReentrant
        returns (uint256)
    {
        require(borrower != address(0), "Invalid borrower");
        require(lender != address(0), "Invalid lender");
        require(amount > 0, "Amount must be positive");
        require(borrower != lender, "Borrower cannot be lender");

        settlementCount += 1;
        uint256 sid = settlementCount;

        settlements[sid] = Settlement({
            settlementId: sid,
            loanId: loanId,
            borrower: borrower,
            lender: lender,
            amount: amount,
            settlementType: erc20Enabled ? SettlementType.ERC20 : SettlementType.NATIVE,
            state: SettlementState.CREATED,
            settlementRef: bytes32(0),
            createdAt: block.timestamp,
            executedAt: 0
        });

        emit SettlementCreated(sid, loanId, borrower, lender, amount);
        return sid;
    }

    /**
     * @notice Execute a settlement — transfer funds to borrower.
     *         For native ETH: must send msg.value >= amount.
     *         For ERC20: caller must have approved this contract.
     * @param settlementId The settlement to execute.
     */
    function executeSettlement(uint256 settlementId)
        external
        payable
        onlyRole(SETTLEMENT_ROLE)
        whenNotPaused
        nonReentrant
    {
        Settlement storage s = settlements[settlementId];
        require(s.settlementId != 0, "Settlement not found");
        require(s.state == SettlementState.CREATED, "Settlement not in CREATED state");

        bytes32 ref = keccak256(abi.encodePacked(
            settlementId, s.loanId, s.borrower, s.amount, block.timestamp
        ));

        if (s.settlementType == SettlementType.ERC20) {
            // ERC20 settlement (HSP/USDC)
            lendingAsset.safeTransferFrom(msg.sender, s.borrower, s.amount);
        } else {
            // Native ETH settlement
            require(msg.value >= s.amount, "Insufficient ETH sent");
            (bool success, ) = s.borrower.call{value: s.amount}("");
            require(success, "ETH transfer failed");

            // Refund excess
            if (msg.value > s.amount) {
                (bool refundOk, ) = msg.sender.call{value: msg.value - s.amount}("");
                require(refundOk, "Refund failed");
            }
        }

        s.state = SettlementState.EXECUTED;
        s.settlementRef = ref;
        s.executedAt = block.timestamp;

        emit SettlementExecuted(settlementId, s.loanId, s.borrower, s.amount, ref);
        emit HSPSettlementCompleted(s.loanId, s.borrower, s.amount, ref);
    }

    /**
     * @notice Verify a completed settlement.
     * @param settlementId The settlement to verify.
     */
    function verifySettlement(uint256 settlementId)
        external
        view
        returns (bool completed, bytes32 settlementRef, uint256 executedAt)
    {
        Settlement storage s = settlements[settlementId];
        require(s.settlementId != 0, "Settlement not found");
        return (
            s.state == SettlementState.EXECUTED || s.state == SettlementState.VERIFIED,
            s.settlementRef,
            s.executedAt
        );
    }

    /**
     * @notice Get full settlement details.
     */
    function getSettlement(uint256 settlementId) external view returns (Settlement memory) {
        require(settlements[settlementId].settlementId != 0, "Settlement not found");
        return settlements[settlementId];
    }

    // ── Admin ────────────────────────────────────────────────────────

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) { _unpause(); }
}
