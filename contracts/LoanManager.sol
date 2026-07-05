// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract LoanManager {
    enum LoanStatus { PENDING, ACTIVE, REPAID, CANCELLED }
    enum SettlementStatus { PENDING, SETTLED, FAILED }

    struct Loan {
        string loanId;
        address borrower;
        uint256 approvedAmount;
        uint256 interestRate;
        uint256 collateralRatio;
        uint256 duration;
        uint256 creationTime;
        uint256 dueDate;
        LoanStatus status;
        bytes32 offerHash;
        string offerId;
    }

    // Storage mappings
    mapping(string => Loan) public loans;
    mapping(address => string[]) public borrowerLoans;
    mapping(string => SettlementStatus) public loanSettlementStatus;

    // Events
    event LoanCreated(string loanId, address indexed borrower, uint256 approvedAmount);
    event LoanActivated(string loanId, uint256 dueDate);
    event LoanRepaid(string loanId);
    event LoanCancelled(string loanId);
    event LoanSettled(string loanId, address borrower, uint256 amount, bytes32 settlementReference);


    // Business rules constraints
    uint256 public constant MAX_DURATION = 365 days;
    uint256 public constant MIN_COLLATERAL_RATIO = 100; // 100%
    uint256 public constant MAX_COLLATERAL_RATIO = 300; // 300%

    /**
     * @notice Create a loan offer on-chain in PENDING status.
     */
    function createLoan(
        string calldata loanId,
        address borrower,
        uint256 approvedAmount,
        uint256 interestRate,
        uint256 collateralRatio,
        uint256 duration,
        bytes32 offerHash,
        string calldata offerId
    ) external {
        require(bytes(loanId).length > 0, "Loan ID cannot be empty");
        require(loans[loanId].borrower == address(0), "Loan already exists");
        require(approvedAmount > 0, "Loan amount must be positive");
        require(duration > 0 && duration <= MAX_DURATION, "Duration exceeds maximum limit");
        require(
            collateralRatio >= MIN_COLLATERAL_RATIO && collateralRatio <= MAX_COLLATERAL_RATIO,
            "Collateral ratio outside bounds"
        );

        loans[loanId] = Loan({
            loanId: loanId,
            borrower: borrower,
            approvedAmount: approvedAmount,
            interestRate: interestRate,
            collateralRatio: collateralRatio,
            duration: duration,
            creationTime: block.timestamp,
            dueDate: 0,
            status: LoanStatus.PENDING,
            offerHash: offerHash,
            offerId: offerId
        });

        borrowerLoans[borrower].push(loanId);

        emit LoanCreated(loanId, borrower, approvedAmount);
    }

    /**
     * @notice Activate a pending loan. Sets the due date.
     */
    function activateLoan(string calldata loanId) external {
        Loan storage loan = loans[loanId];
        require(loan.borrower != address(0), "Loan does not exist");
        require(loan.status == LoanStatus.PENDING, "Loan not in PENDING status");
        require(msg.sender == loan.borrower, "Only the borrower can activate the loan");

        loan.status = LoanStatus.ACTIVE;
        loan.dueDate = block.timestamp + loan.duration;

        emit LoanActivated(loanId, loan.dueDate);
    }

    /**
     * @notice Repay an active loan, transitioning it to REPAID.
     */
    function repayLoan(string calldata loanId) external {
        Loan storage loan = loans[loanId];
        require(loan.borrower != address(0), "Loan does not exist");
        require(loan.status == LoanStatus.ACTIVE, "Loan is not active");
        require(msg.sender == loan.borrower, "Only borrower can repay the loan");

        loan.status = LoanStatus.REPAID;

        emit LoanRepaid(loanId);
    }

    /**
     * @notice Cancel a pending loan before activation.
     */
    function cancelLoan(string calldata loanId) external {
        Loan storage loan = loans[loanId];
        require(loan.borrower != address(0), "Loan does not exist");
        require(loan.status == LoanStatus.PENDING, "Loan is not pending");
        require(msg.sender == loan.borrower, "Only borrower can cancel the loan");

        loan.status = LoanStatus.CANCELLED;

        emit LoanCancelled(loanId);
    }

    /**
     * @notice Get a loan detail.
     */
    function getLoan(string calldata loanId)
        external
        view
        returns (
            string memory,
            address,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            LoanStatus,
            bytes32,
            string memory
        )
    {
        Loan memory loan = loans[loanId];
        require(loan.borrower != address(0), "Loan does not exist");
        return (
            loan.loanId,
            loan.borrower,
            loan.approvedAmount,
            loan.interestRate,
            loan.collateralRatio,
            loan.duration,
            loan.creationTime,
            loan.dueDate,
            loan.status,
            loan.offerHash,
            loan.offerId
        );
    }

    /**
     * @notice Get all loan IDs for a given borrower.
     */
    function getBorrowerLoans(address borrower) external view returns (string[] memory) {
        return borrowerLoans[borrower];
    }

    /**
     * @notice Mark a loan as settled via stablecoin payment.
     */
    function markSettled(string calldata loanId, bytes32 settlementReference) external {
        Loan storage loan = loans[loanId];
        require(loan.borrower != address(0), "Loan does not exist");
        require(loan.status == LoanStatus.PENDING, "Loan not pending");

        loanSettlementStatus[loanId] = SettlementStatus.SETTLED;

        // Automatically activate the loan since funds are settled!
        loan.status = LoanStatus.ACTIVE;
        loan.dueDate = block.timestamp + loan.duration;

        emit LoanSettled(loanId, loan.borrower, loan.approvedAmount, settlementReference);
        emit LoanActivated(loanId, loan.dueDate);
    }

    /**
     * @notice Get the settlement status of a loan.
     */
    function getSettlementStatus(string calldata loanId) external view returns (SettlementStatus) {
        return loanSettlementStatus[loanId];
    }
}

