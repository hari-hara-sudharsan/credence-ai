// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Test } from "forge-std/Test.sol";
import { P2PLendingMarket } from "../contracts/src/P2PLendingMarket.sol";

contract P2PLendingMarketTest is Test {
    P2PLendingMarket market;
    address borrower = address(0xBBBB);
    address lender = address(0xAAAA);
    address other = address(0xCCCC);

    function setUp() public {
        market = new P2PLendingMarket();
        vm.deal(borrower, 10 ether);
        vm.deal(lender, 10 ether);
    }

    // ── createLoanRequest ────────────────────────────────────────────

    function test_CreateLoanRequest() public {
        vm.prank(borrower);
        uint256 id = market.createLoanRequest(
            1 ether,    // amount
            700,        // 7% interest
            90 days,    // duration
            750,        // credit score
            keccak256("Trading liquidity")
        );

        assertEq(id, 0, "First request should have ID 0");
        assertEq(market.totalRequests(), 1);

        P2PLendingMarket.LoanRequest memory req = market.getLoanRequest(0);
        assertEq(req.borrower, borrower);
        assertEq(req.amount, 1 ether);
        assertEq(req.interestRate, 700);
        assertEq(req.creditScore, 750);
        assertEq(uint8(req.status), uint8(P2PLendingMarket.LoanStatus.REQUESTED));
        assertEq(req.lender, address(0));
    }

    function test_CreateLoanRequest_EmitsEvent() public {
        vm.prank(borrower);
        vm.expectEmit(true, true, false, true);
        emit P2PLendingMarket.LoanRequested(0, borrower, 1 ether, 700, 90 days, 750);

        market.createLoanRequest(1 ether, 700, 90 days, 750, keccak256("test"));
    }

    function test_CreateLoanRequest_RevertsZeroAmount() public {
        vm.prank(borrower);
        vm.expectRevert("Amount must be positive");
        market.createLoanRequest(0, 700, 90 days, 750, keccak256("test"));
    }

    function test_CreateLoanRequest_RevertsExcessiveInterest() public {
        vm.prank(borrower);
        vm.expectRevert("Interest rate exceeds 50%");
        market.createLoanRequest(1 ether, 5001, 90 days, 750, keccak256("test"));
    }

    function test_CreateLoanRequest_RevertsZeroDuration() public {
        vm.prank(borrower);
        vm.expectRevert("Invalid duration");
        market.createLoanRequest(1 ether, 700, 0, 750, keccak256("test"));
    }

    // ── fundLoan ─────────────────────────────────────────────────────

    function test_FundLoan() public {
        vm.prank(borrower);
        market.createLoanRequest(1 ether, 700, 90 days, 750, keccak256("test"));

        vm.prank(lender);
        market.fundLoan(0);

        P2PLendingMarket.LoanRequest memory req = market.getLoanRequest(0);
        assertEq(req.lender, lender);
        assertEq(uint8(req.status), uint8(P2PLendingMarket.LoanStatus.FUNDED));
        assertTrue(req.fundedAt > 0);
    }

    function test_FundLoan_EmitsEvent() public {
        vm.prank(borrower);
        market.createLoanRequest(1 ether, 700, 90 days, 750, keccak256("test"));

        vm.prank(lender);
        vm.expectEmit(true, true, true, true);
        emit P2PLendingMarket.LoanFunded(0, lender, borrower, 1 ether);

        market.fundLoan(0);
    }

    function test_FundLoan_RevertsSelfFunding() public {
        vm.prank(borrower);
        market.createLoanRequest(1 ether, 700, 90 days, 750, keccak256("test"));

        vm.prank(borrower);
        vm.expectRevert("Cannot fund own request");
        market.fundLoan(0);
    }

    function test_FundLoan_RevertsAlreadyFunded() public {
        vm.prank(borrower);
        market.createLoanRequest(1 ether, 700, 90 days, 750, keccak256("test"));

        vm.prank(lender);
        market.fundLoan(0);

        vm.prank(other);
        vm.expectRevert("Request not open");
        market.fundLoan(0);
    }

    function test_FundLoan_RemovesFromOpenRequests() public {
        vm.prank(borrower);
        market.createLoanRequest(1 ether, 700, 90 days, 750, keccak256("a"));
        vm.prank(borrower);
        market.createLoanRequest(2 ether, 800, 60 days, 600, keccak256("b"));

        uint256[] memory openBefore = market.getOpenRequests();
        assertEq(openBefore.length, 2);

        vm.prank(lender);
        market.fundLoan(0);

        uint256[] memory openAfter = market.getOpenRequests();
        assertEq(openAfter.length, 1);
        assertEq(openAfter[0], 1);
    }

    // ── activateLoan ─────────────────────────────────────────────────

    function test_ActivateLoan() public {
        vm.prank(borrower);
        market.createLoanRequest(1 ether, 700, 90 days, 750, keccak256("test"));

        vm.prank(lender);
        market.fundLoan(0);

        vm.prank(lender);
        market.activateLoan(0);

        P2PLendingMarket.LoanRequest memory req = market.getLoanRequest(0);
        assertEq(uint8(req.status), uint8(P2PLendingMarket.LoanStatus.ACTIVE));
        assertTrue(req.dueDate > 0);
    }

    function test_ActivateLoan_RevertsNotFunded() public {
        vm.prank(borrower);
        market.createLoanRequest(1 ether, 700, 90 days, 750, keccak256("test"));

        vm.prank(lender);
        vm.expectRevert("Loan not funded");
        market.activateLoan(0);
    }

    // ── repayLoan ────────────────────────────────────────────────────

    function test_RepayLoan() public {
        vm.prank(borrower);
        market.createLoanRequest(1 ether, 700, 90 days, 750, keccak256("test"));

        vm.prank(lender);
        market.fundLoan(0);

        vm.prank(lender);
        market.activateLoan(0);

        vm.prank(borrower);
        market.repayLoan(0);

        P2PLendingMarket.LoanRequest memory req = market.getLoanRequest(0);
        assertEq(uint8(req.status), uint8(P2PLendingMarket.LoanStatus.REPAID));
    }

    function test_RepayLoan_EmitsEvent() public {
        vm.prank(borrower);
        market.createLoanRequest(1 ether, 700, 90 days, 750, keccak256("test"));
        vm.prank(lender);
        market.fundLoan(0);
        vm.prank(lender);
        market.activateLoan(0);

        vm.prank(borrower);
        vm.expectEmit(true, true, true, true);
        emit P2PLendingMarket.LoanRepaid(0, borrower, lender);

        market.repayLoan(0);
    }

    function test_RepayLoan_RevertsNonBorrower() public {
        vm.prank(borrower);
        market.createLoanRequest(1 ether, 700, 90 days, 750, keccak256("test"));
        vm.prank(lender);
        market.fundLoan(0);
        vm.prank(lender);
        market.activateLoan(0);

        vm.prank(other);
        vm.expectRevert("Only borrower can repay");
        market.repayLoan(0);
    }

    // ── View Functions ───────────────────────────────────────────────

    function test_GetBorrowerRequests() public {
        vm.startPrank(borrower);
        market.createLoanRequest(1 ether, 700, 90 days, 750, keccak256("a"));
        market.createLoanRequest(2 ether, 800, 60 days, 600, keccak256("b"));
        vm.stopPrank();

        uint256[] memory ids = market.getBorrowerRequests(borrower);
        assertEq(ids.length, 2);
        assertEq(ids[0], 0);
        assertEq(ids[1], 1);
    }

    function test_GetLenderFundedLoans() public {
        vm.prank(borrower);
        market.createLoanRequest(1 ether, 700, 90 days, 750, keccak256("a"));

        vm.prank(lender);
        market.fundLoan(0);

        uint256[] memory ids = market.getLenderFundedLoans(lender);
        assertEq(ids.length, 1);
        assertEq(ids[0], 0);
    }

    // ── Full Lifecycle ───────────────────────────────────────────────

    function test_FullLifecycle() public {
        // 1. Borrower creates request
        vm.prank(borrower);
        uint256 id = market.createLoanRequest(
            5 ether, 600, 180 days, 820, keccak256("DeFi yield strategy")
        );

        // 2. Lender funds it
        vm.prank(lender);
        market.fundLoan(id);

        // 3. Lender activates after settlement
        vm.prank(lender);
        market.activateLoan(id);

        // 4. Time passes...
        vm.warp(block.timestamp + 30 days);

        // 5. Borrower repays
        vm.prank(borrower);
        market.repayLoan(id);

        P2PLendingMarket.LoanRequest memory req = market.getLoanRequest(id);
        assertEq(uint8(req.status), uint8(P2PLendingMarket.LoanStatus.REPAID));
        assertEq(req.lender, lender);
        assertEq(req.borrower, borrower);
    }
}
