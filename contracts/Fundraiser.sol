// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import 'openzeppelin-solidity/contracts/access/Ownable.sol' ;

contract Fundraiser is Ownable {
    string public name ;
    string public url ;
    string public imageUrl ;
    string public description ;
    address payable public beneficiary ;
    address public _owner ;

    constructor(
        string memory _name ,
        string memory _url ,
        string memory  _imageUrl ,
        string memory _description ,
        address payable  _beneficiary ,
        address _custodian
    )
    {
        name = _name ;
        url = _url ;
        imageUrl = _imageUrl ;
        description = _description ;
        beneficiary = _beneficiary ;
        _transferOwnership(_custodian) ;
    }

    function setBeneficiary(
        address payable _newbeneficiary 
    )
    public
    onlyOwner
    {
        beneficiary = _newbeneficiary ;
    }
}