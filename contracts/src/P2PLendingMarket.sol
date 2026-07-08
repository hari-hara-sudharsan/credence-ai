// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title P2PLendingMarket
 * @notice Peer-to-peer lending marketplace where borrowers create loan requests
 *         and lenders fund them directly. Manages the full lifecycle:
 *         Request → Fund → Activate → Repay.
 */
contract P2PLendingMarket {

    enum LoanStatus { REQUESTED, FUNDED, ACTIVE, REPAID, DEFAULTED }

    struct LoanRequest {
        uint256 id;
        address borrower;
        address lender;
        uint256 amount;           // in wei
        uint256 interestRate;     // basis points (e.g. 700 = 7%)
        uint256 duration;         // seconds
        LoanStatus status;
        uint256 creditScore;      // borrower's score at request time
        bytes32 purpose;          // hashed purpose string
        uint256 createdAt;
        uint256 fundedAt;
        uint256 dueDate;
    }

    // ── Storage ──────────────────────────────────────────────────────────
    uint256 public nextRequestId;
    mapping(uint256 => LoanRequest) public loanRequests;
    mapping(address => uint256[]) public borrowerRequests;
    mapping(address => uint256[]) public lenderFunded;
    uint256[] public openRequestIds;

    // ── Events ───────────────────────────────────────────────────────────
    event LoanRequested(
        uint256 indexed requestId,
        address indexed borrower,
        uint256 amount,
        uint256 interestRate,
        uint256 duration,
        uint256 creditScore
    );

    event LoanFunded(
        uint256 indexed requestId,
        address indexed lender,
        address indexed borrower,
        uint256 amount
    );

    event LoanActivated(uint256 indexed requestId, uint256 dueDate);

    event LoanRepaid(
        uint256 indexed requestId,
        address indexed borrower,
        address indexed lender
    );

    // ── Borrower Functions ───────────────────────────────────────────────

    /**
     * @notice Create a new loan request in the marketplace.
     * @param amount Requested loan amount in wei.
     * @param interestRate Interest rate in basis points (700 = 7%).
     * @param duration Loan duration in seconds.
     * @param creditScore Borrower's AI credit score at request time.
     * @param purpose Hashed purpose string (keccak256 of purpose text).
     */
    function createLoanRequest(
        uint256 amount,
        uint256 interestRate,
        uint256 duration,
        uint256 creditScore,
        bytes32 purpose
    ) external returns (uint256) {
        require(amount > 0, "Amount must be positive");
        require(duration > 0 && duration <= 365 days, "Invalid duration");
        require(interestRate <= 5000, "Interest rate exceeds 50%");

        uint256 requestId = nextRequestId++;

        loanRequests[requestId] = LoanRequest({
            id: requestId,
            borrower: msg.sender,
            lender: address(0),
            amount: amount,
            interestRate: interestRate,
            duration: duration,
            status: LoanStatus.REQUESTED,
            creditScore: creditScore,
            purpose: purpose,
            createdAt: block.timestamp,
            fundedAt: 0,
            dueDate: 0
        });

        borrowerRequests[msg.sender].push(requestId);
        openRequestIds.push(requestId);

        emit LoanRequested(requestId, msg.sender, amount, interestRate, duration, creditScore);

        return requestId;
    }

    // ── Lender Functions ─────────────────────────────────────────────────

    /**
     * @notice Fund an open loan request. Lender commits to providing capital.
     * @param requestId The ID of the loan request to fund.
     */
    function fundLoan(uint256 requestId) external {
        LoanRequest storage req = loanRequests[requestId];
        require(req.borrower != address(0), "Request does not exist");
        require(req.status == LoanStatus.REQUESTED, "Request not open");
        require(msg.sender != req.borrower, "Cannot fund own request");

        req.lender = msg.sender;
        req.status = LoanStatus.FUNDED;
        req.fundedAt = block.timestamp;

        lenderFunded[msg.sender].push(requestId);

        // Remove from open requests
        _removeFromOpenRequests(requestId);

        emit LoanFunded(requestId, msg.sender, req.borrower, req.amount);
    }

    /**
     * @notice Activate a funded loan. Sets the repayment due date.
     *         Can be called by the lender after settlement is confirmed.
     * @param requestId The ID of the funded loan request.
     */
    function activateLoan(uint256 requestId) external {
        LoanRequest storage req = loanRequests[requestId];
        require(req.borrower != address(0), "Request does not exist");
        require(req.status == LoanStatus.FUNDED, "Loan not funded");
        require(
            msg.sender == req.lender || msg.sender == req.borrower,
            "Only lender or borrower can activate"
        );

        req.status = LoanStatus.ACTIVE;
        req.dueDate = block.timestamp + req.duration;

        emit LoanActivated(requestId, req.dueDate);
    }

    // ── Repayment ────────────────────────────────────────────────────────

    /**
     * @notice Repay an active loan.
     * @param requestId The ID of the active loan.
     */
    function repayLoan(uint256 requestId) external {
        LoanRequest storage req = loanRequests[requestId];
        require(req.borrower != address(0), "Request does not exist");
        require(req.status == LoanStatus.ACTIVE, "Loan not active");
        require(msg.sender == req.borrower, "Only borrower can repay");

        req.status = LoanStatus.REPAID;

        emit LoanRepaid(requestId, req.borrower, req.lender);
    }

    // ── View Functions ───────────────────────────────────────────────────

    /**
     * @notice Get full details of a loan request.
     */
    function getLoanRequest(uint256 requestId) external view returns (LoanRequest memory) {
        require(loanRequests[requestId].borrower != address(0), "Request does not exist");
        return loanRequests[requestId];
    }

    /**
     * @notice Get all request IDs for a borrower.
     */
    function getBorrowerRequests(address borrower) external view returns (uint256[] memory) {
        return borrowerRequests[borrower];
    }

    /**
     * @notice Get all funded loan IDs for a lender.
     */
    function getLenderFundedLoans(address lender) external view returns (uint256[] memory) {
        return lenderFunded[lender];
    }

    /**
     * @notice Get all currently open request IDs.
     */
    function getOpenRequests() external view returns (uint256[] memory) {
        return openRequestIds;
    }

    /**
     * @notice Get the total number of requests ever created.
     */
    function totalRequests() external view returns (uint256) {
        return nextRequestId;
    }

    // ── Internal ─────────────────────────────────────────────────────────

    function _removeFromOpenRequests(uint256 requestId) internal {
        uint256 length = openRequestIds.length;
        for (uint256 i = 0; i < length; i++) {
            if (openRequestIds[i] == requestId) {
                openRequestIds[i] = openRequestIds[length - 1];
                openRequestIds.pop();
                return;
            }
        }
    }
}
