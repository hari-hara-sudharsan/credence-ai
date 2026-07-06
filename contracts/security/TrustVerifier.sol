// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title TrustVerifier
 * @notice Verifies EIP-712 signatures for AI-generated trust metrics and prevents transaction replay.
 */
contract TrustVerifier is AccessControl {
    bytes32 public constant DOMAIN_TYPEHASH = keccak256(
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );

    bytes32 public constant TRUST_TYPEHASH = keccak256(
        "TrustData(address entity,uint256 trustScore,uint256 nonce,uint256 expiry)"
    );

    bytes32 public immutable DOMAIN_SEPARATOR;

    // Entity wallet -> Nonce -> Status
    mapping(address => mapping(uint256 => bool)) public usedNonces;

    constructor() {
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                DOMAIN_TYPEHASH,
                keccak256(bytes("Credence Trust")),
                keccak256(bytes("1")),
                177, // Cancun EVM / HashKey Chain ID
                address(this)
            )
        );
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Checks signature expiration, verifies signer matching expected, and records nonce usage.
     */
    function verifyTrustSignature(
        address entity,
        uint256 trustScore,
        uint256 nonce,
        uint256 expiry,
        bytes calldata signature,
        address expectedSigner
    ) external returns (bool) {
        require(block.timestamp <= expiry, "Signature has expired");
        require(!usedNonces[entity][nonce], "Replay attack detected: nonce already used");
        
        bytes32 structHash = keccak256(
            abi.encode(
                TRUST_TYPEHASH,
                entity,
                trustScore,
                nonce,
                expiry
            )
        );
        
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                structHash
            )
        );
        
        address recovered = recoverSigner(digest, signature);
        require(recovered == expectedSigner, "Invalid signature: signer mismatch");
        
        usedNonces[entity][nonce] = true;
        return true;
    }

    /**
     * @notice Helper to check if a specific nonce is already marked as consumed
     */
    function isNonceUsed(address entity, uint256 nonce) external view returns (bool) {
        return usedNonces[entity][nonce];
    }

    /**
     * @notice Recover the signer address from digest and signature bytes.
     */
    function recoverSigner(bytes32 digest, bytes memory signature) public pure returns (address) {
        if (signature.length != 65) {
            return address(0);
        }
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
        return ecrecover(digest, v, r, s);
    }
}
