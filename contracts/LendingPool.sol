// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LendingPool is ReentrancyGuard, Ownable {
    struct PoolStats {
        uint256 totalDeposits;
        uint256 totalBorrowed;
        uint256 availableLiquidity;
        uint256 totalInterestEarned;
    }

    mapping(address => uint256) public lenderBalances;
    PoolStats public stats;

    event LiquidityDeposited(address indexed lender, uint256 amount);
    event LiquidityWithdrawn(address indexed lender, uint256 amount);
    event LoanAllocated(address indexed borrower, uint256 amount);
    event RepaymentReceived(uint256 amount, uint256 interest);

    constructor() Ownable(msg.sender) {}

    function deposit() external payable nonReentrant {
        require(msg.value > 0, "Amount must be positive");
        lenderBalances[msg.sender] += msg.value;
        stats.totalDeposits += msg.value;
        stats.availableLiquidity += msg.value;

        emit LiquidityDeposited(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be positive");
        require(lenderBalances[msg.sender] >= amount, "Insufficient balance");
        require(stats.availableLiquidity >= amount, "Insufficient pool liquidity");

        lenderBalances[msg.sender] -= amount;
        stats.totalDeposits -= amount;
        stats.availableLiquidity -= amount;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdraw transfer failed");

        emit LiquidityWithdrawn(msg.sender, amount);
    }

    function allocateLoan(address borrower, uint256 amount) external onlyOwner nonReentrant {
        require(borrower != address(0), "Invalid borrower address");
        require(amount > 0, "Amount must be positive");
        require(stats.availableLiquidity >= amount, "Insufficient liquidity");

        stats.availableLiquidity -= amount;
        stats.totalBorrowed += amount;

        (bool success, ) = borrower.call{value: amount}("");
        require(success, "Loan allocation failed");

        emit LoanAllocated(borrower, amount);
    }

    function recordRepayment(uint256 amount, uint256 interest) external payable onlyOwner nonReentrant {
        require(msg.value >= amount + interest, "Insufficient value sent");

        stats.availableLiquidity += amount + interest;
        if (stats.totalBorrowed >= amount) {
            stats.totalBorrowed -= amount;
        } else {
            stats.totalBorrowed = 0;
        }
        stats.totalInterestEarned += interest;

        emit RepaymentReceived(amount, interest);
    }

    function getPoolStats() external view returns (PoolStats memory) {
        return stats;
    }
}
