// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VerificationRegistry
 * @notice Stores immutable verification metadata hashes for the Universal Credit Verification Network (UCVN).
 */
contract VerificationRegistry is Ownable {
    
    struct Verification {
        bytes32 verificationHash;
        bytes32 passportHash;
        bytes32 attestationHash;
        address wallet;
        uint256 timestamp;
    }

    // Storage Mappings
    mapping(bytes32 => Verification) public verifications;
    mapping(address => bytes32) public walletVerifications; // wallet -> latest verificationHash

    // Events
    event VerificationPublished(
        bytes32 indexed verificationHash,
        bytes32 indexed passportHash,
        bytes32 attestationHash,
        address indexed wallet,
        uint256 timestamp
    );


    constructor() Ownable(msg.sender) {}

    /**
     * @notice Publishes a new credit verification proof hash to the registry.
     */
    function publishVerification(
        bytes32 verificationHash,
        bytes32 passportHash,
        bytes32 attestationHash,
        address wallet
    ) external {
        require(wallet != address(0), "Invalid wallet address");
        require(verifications[verificationHash].wallet == address(0), "Verification already exists");

        verifications[verificationHash] = Verification({
            verificationHash: verificationHash,
            passportHash: passportHash,
            attestationHash: attestationHash,
            wallet: wallet,
            timestamp: block.timestamp
        });

        walletVerifications[wallet] = verificationHash;

        emit VerificationPublished(verificationHash, passportHash, attestationHash, wallet, block.timestamp);
    }

    /**
     * @notice Verifies a verification hash reference.
     */
    function verify(bytes32 verificationHash)
        external
        view
        returns (
            bool exists,
            address wallet,
            uint256 timestamp
        )
    {
        Verification memory verification = verifications[verificationHash];
        exists = (verification.wallet != address(0));
        wallet = verification.wallet;
        timestamp = verification.timestamp;
    }

    /**
     * @notice Retrieves the detailed verification record.
     */
    function getVerification(bytes32 verificationHash)
        external
        view
        returns (Verification memory)
    {
        require(verifications[verificationHash].wallet != address(0), "Verification not found");
        return verifications[verificationHash];
    }
}
