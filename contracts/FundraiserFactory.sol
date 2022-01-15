// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol" ;
import './Fundraiser.sol' ;

contract FundraiserFactory{
    using SafeMath for uint256 ;
   
    Fundraiser[] private _fundraisers ;

    //events
    event FundraiserEvent( Fundraiser indexed fundraiser , address indexed owner );

    //constants
    uint256 constant maxLimit = 20 ;

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
    
    function fundraisers(uint256 limit, uint256 offset)
    public
    view
    returns (Fundraiser[] memory coll)
    {
        require(offset<=fundraisersCount(),'offset out of bounds');
        uint256 size = fundraisersCount() - offset ;
        size = size < limit ? size : limit ;
        size = size < maxLimit ? size : maxLimit ;
        coll = new Fundraiser[](size);
        for(uint256 i=0 ; i<size ; i++){
            coll[i] = _fundraisers[offset+i] ;
        }
        return coll; 
    }
}
