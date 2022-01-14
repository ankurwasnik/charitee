// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract Fundraiser is Ownable {
    struct Donation {
        uint256 value;
        //uint256 conversionRate;
        uint256 date;
    }

    mapping(address => Donation[]) private _donations;

    string public name;
    string public url;
    string public imageUrl;
    string public description;
    address payable public beneficiary;
    address public _owner;

    constructor(
        string memory _name,
        string memory _url,
        string memory _imageUrl,
        string memory _description,
        address payable _beneficiary,
        address _custodian
    ) {
        name = _name;
        url = _url;
        imageUrl = _imageUrl;
        description = _description;
        beneficiary = _beneficiary;
        _transferOwnership(_custodian);
    }

    function setBeneficiary(address payable _newbeneficiary) public onlyOwner {
        beneficiary = _newbeneficiary;
    }

    function myDonationsCount() public view returns(uint256) {
        return _donations[msg.sender].length ;
    }

    function donate() public payable{
        Donation memory newDonation = Donation({
            value:msg.value ,
            date: block.timestamp
        });
        _donations[msg.sender].push(newDonation);
    }
    function myDonations( ) public view  returns(uint256[] memory values, uint256[] memory dates) {
        uint256 count = myDonationsCount();
        values = new uint256[](count) ;
        dates = new uint256[](count) ;
        for(uint256 i=0 ; i<count ; i++){
            Donation storage donation = _donations[msg.sender][i] ;
            values[i] = donation.value ;
            dates[i] = donation.date ;
        }
        return (values,dates);
    }
}
