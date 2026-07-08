// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CreditRegistry {

    struct CreditProfile {

        uint256 creditScore;

        string rating;

        uint256 confidence;

        uint256 updatedAt;
    }

    mapping(address => CreditProfile)
        public profiles;

    event CreditUpdated(

        address indexed wallet,

        uint256 score,

        string rating,

        uint256 confidence
    );

    function updateCreditProfile(

        address wallet,

        uint256 score,

        string memory rating,

        uint256 confidence

    ) public {

        profiles[wallet] = CreditProfile({

            creditScore: score,

            rating: rating,

            confidence: confidence,

            updatedAt: block.timestamp
        });

        emit CreditUpdated(

            wallet,

            score,

            rating,

            confidence
        );
    }

    function getCreditProfile(

        address wallet

    )

        public

        view

        returns (

            uint256,

            string memory,

            uint256,

            uint256
        )

    {

        CreditProfile memory p =

            profiles[wallet];

        return (

            p.creditScore,

            p.rating,

            p.confidence,

            p.updatedAt
        );
    }
}