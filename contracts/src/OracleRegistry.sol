// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title OracleRegistry
 * @notice Canonical registry for verifiable AI underwriting attestations with Multi-Oracle Consensus.
 */
contract OracleRegistry {
    enum OracleStatus { INACTIVE, ACTIVE, REVOKED, RETIRED }

    struct OracleInfo {
        OracleStatus status;
        string version;
        uint256 lastUpdated;
    }

    struct OracleRecord {
        bytes32 attestationHash;
        bytes32 offerHash;
        address wallet;
        address oracle;
        uint256 timestamp;
        uint256 expiry;
        bool revoked;
    }

    // Storage Mappings
    mapping(bytes32 => OracleRecord) public records;
    mapping(address => OracleInfo) public oracles;
    address[] public oracleAddresses;

    // Configuration
    uint256 public threshold;
    address public governor;

    // Events
    event AttestationPublished(
        bytes32 indexed attestationHash,
        bytes32 indexed offerHash,
        address indexed wallet,
        address oracle
    );
    event AttestationRevoked(bytes32 indexed attestationHash);
    event OracleRegistered(address indexed oracle, string version);
    event OracleStatusChanged(address indexed oracle, OracleStatus status);
    event ThresholdChanged(uint256 newThreshold);
    event GovernorTransferred(address indexed newGovernor);

    modifier onlyGovernor() {
        require(msg.sender == governor, "Only governor can call this function");
        _;
    }

    constructor(address[] memory initialOracles, uint256 initialThreshold) {
        governor = msg.sender;
        require(initialThreshold > 0, "Threshold must be greater than zero");
        require(initialThreshold <= initialOracles.length, "Threshold exceeds total initial oracles");
        
        for (uint256 i = 0; i < initialOracles.length; i++) {
            address oracle = initialOracles[i];
            require(oracle != address(0), "Invalid oracle address");
            require(oracles[oracle].status == OracleStatus.INACTIVE, "Oracle already added");
            
            oracles[oracle] = OracleInfo({
                status: OracleStatus.ACTIVE,
                version: "1.0.0",
                lastUpdated: block.timestamp
            });
            oracleAddresses.push(oracle);
            emit OracleRegistered(oracle, "1.0.0");
        }
        
        threshold = initialThreshold;
        emit ThresholdChanged(initialThreshold);
    }

    /**
     * @notice Register a new oracle signer.
     */
    function addOracle(address oracle, string calldata version) external onlyGovernor {
        require(oracle != address(0), "Invalid oracle address");
        require(oracles[oracle].status == OracleStatus.INACTIVE, "Oracle already registered");

        oracles[oracle] = OracleInfo({
            status: OracleStatus.ACTIVE,
            version: version,
            lastUpdated: block.timestamp
        });
        oracleAddresses.push(oracle);
        emit OracleRegistered(oracle, version);
    }

    /**
     * @notice Set status of an oracle signer.
     */
    function setOracleStatus(address oracle, OracleStatus status) external onlyGovernor {
        require(oracles[oracle].status != OracleStatus.INACTIVE, "Oracle not registered");
        oracles[oracle].status = status;
        oracles[oracle].lastUpdated = block.timestamp;
        emit OracleStatusChanged(oracle, status);
    }

    /**
     * @notice Set signature threshold required for consensus.
     */
    function setThreshold(uint256 newThreshold) external onlyGovernor {
        require(newThreshold > 0, "Threshold must be greater than zero");
        
        // Count active oracles to validate threshold
        uint256 activeCount = 0;
        for (uint256 i = 0; i < oracleAddresses.length; i++) {
            if (oracles[oracleAddresses[i]].status == OracleStatus.ACTIVE) {
                activeCount++;
            }
        }
        require(newThreshold <= activeCount, "Threshold exceeds active oracle count");
        threshold = newThreshold;
        emit ThresholdChanged(newThreshold);
    }

    /**
     * @notice Transfer governor role.
     */
    function transferGovernor(address newGovernor) external onlyGovernor {
        require(newGovernor != address(0), "Invalid governor address");
        governor = newGovernor;
        emit GovernorTransferred(newGovernor);
    }

    /**
     * @notice Publish an underwriting attestation record with Multi-Oracle Consensus.
     * @param attestationHash Hash of the underwriting attestation (e.g. hash of signature or raw data)
     * @param offerHash Hash of the loan offer terms
     * @param wallet Address of the borrower
     * @param expiry Expiration timestamp
     * @param signatures Signatures from authorized oracles verifying this attestation
     */
    function publishAttestation(
        bytes32 attestationHash,
        bytes32 offerHash,
        address wallet,
        uint256 expiry,
        bytes[] calldata signatures
    ) external {
        require(records[attestationHash].wallet == address(0), "Attestation already published");
        require(wallet != address(0), "Invalid wallet address");
        require(expiry > block.timestamp, "Expiry must be in the future");
        require(signatures.length >= threshold, "Insufficient signatures for threshold");

        // Verify signatures
        bytes32 messageDigest = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", attestationHash)
        );
        validateConsensus(messageDigest, signatures);

        records[attestationHash] = OracleRecord({
            attestationHash: attestationHash,
            offerHash: offerHash,
            wallet: wallet,
            oracle: msg.sender,
            timestamp: block.timestamp,
            expiry: expiry,
            revoked: false
        });

        emit AttestationPublished(attestationHash, offerHash, wallet, msg.sender);
    }

    /**
     * @notice Revoke an underwriting attestation record with Multi-Oracle Consensus.
     */
    function revokeAttestation(bytes32 attestationHash, bytes[] calldata signatures) external {
        require(records[attestationHash].wallet != address(0), "Attestation not found");
        require(!records[attestationHash].revoked, "Attestation already revoked");
        require(signatures.length >= threshold, "Insufficient signatures for threshold");

        // Revocation digest (different prefix to avoid reuse)
        bytes32 revocationDigest = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodePacked("REVOKE:", attestationHash)))
        );
        validateConsensus(revocationDigest, signatures);

        records[attestationHash].revoked = true;
        emit AttestationRevoked(attestationHash);
    }

    /**
     * @notice Internal validation of unique active oracle signers.
     */
    function validateConsensus(bytes32 digest, bytes[] calldata signatures) internal view {
        uint256 validCount = 0;
        address[] memory recovered = new address[](signatures.length);

        for (uint256 i = 0; i < signatures.length; i++) {
            address signer = recoverSigner(digest, signatures[i]);
            if (oracles[signer].status == OracleStatus.ACTIVE) {
                // Check duplicate
                bool isDuplicate = false;
                for (uint256 j = 0; j < validCount; j++) {
                    if (recovered[j] == signer) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    recovered[validCount] = signer;
                    validCount++;
                }
            }
        }
        require(validCount >= threshold, "Consensus threshold check failed");
    }

    /**
     * @notice Get metadata verification status for a specific attestation hash.
     */
    function verifyAttestation(bytes32 attestationHash)
        external
        view
        returns (
            bool exists,
            bool verified,
            bool revoked,
            bool expired,
            address oracle,
            uint256 timestamp
        )
    {
        OracleRecord memory rec = records[attestationHash];
        exists = (rec.wallet != address(0));
        if (exists) {
            revoked = rec.revoked;
            expired = (block.timestamp > rec.expiry);
            verified = (!revoked && !expired);
            oracle = rec.oracle;
            timestamp = rec.timestamp;
        } else {
            revoked = false;
            expired = false;
            verified = false;
            oracle = address(0);
            timestamp = 0;
        }
    }

    /**
     * @notice Helper function to recover signer address from signature.
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

    // ═══════════════════════════════════════════════════════════════════
    //  EIP-712 Credit Attestation — Signed AI Underwriting Decisions
    // ═══════════════════════════════════════════════════════════════════

    struct CreditAttestation {
        address borrower;
        uint256 score;
        uint256 maxLoan;
        uint256 interestRate;    // basis points (e.g. 500 = 5%)
        uint256 expiry;
        uint256 nonce;
    }

    // Nonce tracking for replay protection
    mapping(address => uint256) public nonces;
    // Used attestation hashes (double-spend protection)
    mapping(bytes32 => bool) public usedAttestations;

    // EIP-712 Domain Separator components
    bytes32 public constant DOMAIN_TYPEHASH = keccak256(
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );
    bytes32 public constant CREDIT_ATTESTATION_TYPEHASH = keccak256(
        "CreditAttestation(address borrower,uint256 score,uint256 maxLoan,uint256 interestRate,uint256 expiry,uint256 nonce)"
    );

    event CreditAttestationVerified(
        address indexed borrower,
        uint256 score,
        uint256 maxLoan,
        uint256 interestRate,
        address indexed oracle,
        uint256 nonce
    );

    /**
     * @notice Build the EIP-712 domain separator.
     */
    function domainSeparator() public view returns (bytes32) {
        return keccak256(abi.encode(
            DOMAIN_TYPEHASH,
            keccak256("CredenceAI"),
            keccak256("1"),
            block.chainid,
            address(this)
        ));
    }

    /**
     * @notice Compute the EIP-712 struct hash for a CreditAttestation.
     */
    function hashAttestation(CreditAttestation memory att) public pure returns (bytes32) {
        return keccak256(abi.encode(
            CREDIT_ATTESTATION_TYPEHASH,
            att.borrower,
            att.score,
            att.maxLoan,
            att.interestRate,
            att.expiry,
            att.nonce
        ));
    }

    /**
     * @notice Verify an EIP-712 signed credit attestation from an oracle.
     * @dev Checks: valid signer, active oracle, not expired, nonce correct, not reused.
     * @param att The credit attestation data.
     * @param signature The EIP-712 signature from the oracle.
     * @return signer The verified oracle address.
     */
    function verifyCreditAttestation(
        CreditAttestation calldata att,
        bytes calldata signature
    ) external returns (address signer) {
        // 1. Check expiry
        require(block.timestamp < att.expiry, "Attestation expired");

        // 2. Check nonce (replay protection)
        require(att.nonce == nonces[att.borrower], "Invalid nonce");

        // 3. Build EIP-712 digest
        bytes32 structHash = hashAttestation(att);
        bytes32 digest = keccak256(abi.encodePacked(
            "\x19\x01",
            domainSeparator(),
            structHash
        ));

        // 4. Check not already used
        require(!usedAttestations[digest], "Attestation already used");

        // 5. Recover signer
        signer = recoverSigner(digest, signature);
        require(signer != address(0), "Invalid signature");

        // 6. Verify signer is an active oracle
        require(oracles[signer].status == OracleStatus.ACTIVE, "Signer is not an active oracle");

        // 7. Mark as used and increment nonce
        usedAttestations[digest] = true;
        nonces[att.borrower] += 1;

        emit CreditAttestationVerified(
            att.borrower,
            att.score,
            att.maxLoan,
            att.interestRate,
            signer,
            att.nonce
        );

        return signer;
    }

    /**
     * @notice Get current nonce for a borrower (for frontend signing).
     */
    function getNonce(address borrower) external view returns (uint256) {
        return nonces[borrower];
    }
}
