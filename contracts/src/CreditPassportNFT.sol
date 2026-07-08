// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CreditPassportNFT is
    ERC721URIStorage,
    Ownable
{
    uint256 public nextTokenId;

    constructor()
        ERC721(
            "Credence Credit Passport",
            "CCP"
        )
        Ownable(msg.sender)
    {}

    function mintPassport(
        address user,
        string memory metadataURI
    )
        public
        returns (uint256)
    {
        uint256 tokenId =
            nextTokenId;

        _mint(
            user,
            tokenId
        );

        _setTokenURI(
            tokenId,
            metadataURI
        );

        nextTokenId++;

        return tokenId;
    }
}