// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title TrustEvolution
 * @notice On-chain ledger of major credit and trust transition events for Credence AI.
 */
contract TrustEvolution is AccessControl, Pausable {
    bytes32 public constant EVOLUTION_RECORD_ROLE = keccak256("EVOLUTION_RECORD_ROLE");

    struct TrustEvolutionEvent {
        address wallet;
        uint256 previousScore;
        uint256 newScore;
        string reason;
        uint256 timestamp;
    }

    mapping(address => TrustEvolutionEvent[]) private _evolutionHistory;

    event TrustEvolved(address indexed wallet, uint256 oldScore, uint256 newScore);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(EVOLUTION_RECORD_ROLE, admin);
    }

    /**
     * @notice Record a major trust transition for a wallet.
     */
    function recordEvolution(
        address wallet,
        uint256 previousScore,
        uint256 newScore,
        string calldata reason
    ) external onlyRole(EVOLUTION_RECORD_ROLE) whenNotPaused {
        require(wallet != address(0), "Invalid wallet address");

        _evolutionHistory[wallet].push(TrustEvolutionEvent({
            wallet: wallet,
            previousScore: previousScore,
            newScore: newScore,
            reason: reason,
            timestamp: block.timestamp
        }));

        emit TrustEvolved(wallet, previousScore, newScore);
    }

    /**
     * @notice Retrieve the trust evolution history timeline for a wallet.
     */
    function getEvolutionHistory(address wallet) external view returns (TrustEvolutionEvent[] memory) {
        return _evolutionHistory[wallet];
    }

    /**
     * @notice Verify a specific evolution index entry on-chain.
     */
    function verifyEvolution(address wallet, uint256 index) external view returns (
        bool exists,
        uint256 previousScore,
        uint256 newScore,
        string memory reason,
        uint256 timestamp
    ) {
        if (index >= _evolutionHistory[wallet].length) {
            return (false, 0, 0, "", 0);
        }
        TrustEvolutionEvent storage ev = _evolutionHistory[wallet][index];
        return (true, ev.previousScore, ev.newScore, ev.reason, ev.timestamp);
    }

    /**
     * @notice Pauses evolution entries.
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice Unpauses evolution entries.
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
