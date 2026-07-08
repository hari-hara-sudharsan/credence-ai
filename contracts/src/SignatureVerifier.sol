// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title SignatureVerifier
 * @notice Verifies EIP-712 signatures for AI loan underwriting decisions.
 */
contract SignatureVerifier {
    bytes32 public constant DOMAIN_TYPEHASH = keccak256(
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );

    bytes32 public constant OFFER_TYPEHASH = keccak256(
        "UnderwritingOffer(address wallet,bytes32 offerHash,uint256 creditScore,uint256 approvedAmount,uint256 interestRate,uint256 collateralRatio,uint256 duration,uint256 expiry)"
    );

    bytes32 public immutable DOMAIN_SEPARATOR;

    struct UnderwritingOffer {
        address wallet;
        bytes32 offerHash;
        uint256 creditScore;
        uint256 approvedAmount;
        uint256 interestRate;
        uint256 collateralRatio;
        uint256 duration;
        uint256 expiry;
    }

    /**
     * @notice Construct the verifier and initialize the DOMAIN_SEPARATOR.
     * @param verifyingContract The address of the LoanManager contract.
     */
    constructor(address verifyingContract) {
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                DOMAIN_TYPEHASH,
                keccak256(bytes("Credence AI")),
                keccak256(bytes("1")),
                133, // HashKey Chain Testnet ID
                verifyingContract
            )
        );
    }

    /**
     * @notice Hash the underwriting offer struct.
     */
    function hashOffer(UnderwritingOffer memory offer) public pure returns (bytes32) {
        return keccak256(
            abi.encode(
                OFFER_TYPEHASH,
                offer.wallet,
                offer.offerHash,
                offer.creditScore,
                offer.approvedAmount,
                offer.interestRate,
                offer.collateralRatio,
                offer.duration,
                offer.expiry
            )
        );
    }

    /**
     * @notice Verify standard EIP-712 signature against expected signer.
     */
    function verifyOffer(
        UnderwritingOffer memory offer,
        bytes memory signature,
        address expectedSigner
    ) public view returns (bool) {
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                hashOffer(offer)
            )
        );
        return recoverSigner(digest, signature) == expectedSigner;
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
