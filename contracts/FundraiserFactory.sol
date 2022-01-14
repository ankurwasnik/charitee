// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol" ;
import './Fundraiser.sol' ;

contract FundraiserFactory{
    using SafeMath for uint256 ;
   
    Fundraiser[] private _fundraisers ;

    //events
    event FundraiserEvent( Fundraiser indexed fundraiser , address indexed owner );

    function createFundraiser(
        string memory _name,
        string memory _url,
        string memory _imageUrl,
        string memory _description,
        address payable _beneficiary
    )
    public
    {
        Fundraiser newFundraiser = new Fundraiser(
            _name,
            _url,
            _imageUrl,
            _description,
            _beneficiary,
            msg.sender
        );
        _fundraisers.push(newFundraiser) ;
        emit FundraiserEvent(newFundraiser,msg.sender);
    }

    function fundraisersCount ( )
        public
        view
        returns(uint256)
    {
        return _fundraisers.length ;
    }
}