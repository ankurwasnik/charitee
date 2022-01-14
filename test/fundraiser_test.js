const FundraiserContract = artifacts.require("Fundraiser");

contract('Fundraiser', accounts =>{
    let fundraiser ;
    const name="Beneficiary Name";
    const url = "beneficiary.org";
    const imageUrl = "https://placekitten.com/600/500";
    const description = "Beneficiary description";
    const beneficiary = accounts[1] ;
    const owner = accounts[0] ;
   
    beforeEach(async()=>{
        fundraiser = await FundraiserContract.new(
            name,
            url,
            imageUrl,
            description,
            beneficiary ,
            owner
        );
    });

    describe('initialization', () => {
        

        it('gets the beneficiary name', async () => {
            const actual = await fundraiser.name() ;
            assert.equal(actual , name,"names should match");
        });

        it('gets the beneficiary url', async () => {
            const actual = await fundraiser.url() ;
            assert.equal(actual , url,"url should match");
        });

        it('gets the beneficiary imageUrl ', async ()=>{
            const actual = await fundraiser.imageUrl();
            assert.equal(imageUrl,actual,"imageUrl should match");
        });

        it('gets the beneficiary description', async () => {
            const actual = await fundraiser.description() ;
            assert.equal(description,actual,"description should match");
        });

        it('gets the beneficiary address', async () => {
            const actual = await fundraiser.beneficiary() ;
            assert.equal(beneficiary ,actual , 'beneficiary should match');
        });

        it('gets the owner address' , async()=>{
            const actual = await fundraiser.owner() ;
            assert.equal(owner,actual,'owner should match');
        });
    });

    describe('setBeneficiary', () => {
       const newBeneficiary = accounts[2] ;
       it('updated beneficiary when called by owner account', async()=>{
           await fundraiser.setBeneficiary(newBeneficiary,{from:owner}) ;
           const actualBeneficiary = await fundraiser.beneficiary() ;
           assert.equal(newBeneficiary , actualBeneficiary, 'beneficiaries should match') ;
       });

       it('throws an error when called from a non-owner account', async()=>{
           try{
               await fundraiser.setBeneficiary(newBeneficiary,{from:accounts[3]});
               assert.fail('withdraw was not restricted to owners') ;
           }
           catch(error){
                const expectError = "Ownable: caller is not the owner" ;
                const actualError = error.reason ;
                assert.equal(actualError,expectError,'should not be permitted');
           }
       })
    });

    describe('making donations',()=>{
        const value = web3.utils.toWei('0.0289');
        const donor = accounts[2] ;

        it('increases myDonationsCount', async () => {
            const currentDonationsCount = await fundraiser.myDonationsCount({from:donor}) ;
            await fundraiser.donate({from:donor,value});
            const newDonationsCount = await fundraiser.myDonationsCount({from:donor});
            assert.equal(1,newDonationsCount-currentDonationsCount,'donation count should increase by one')
        });

        it('includes donation in myDonations', async () => {
            await fundraiser.donate({from:donor, value});
            const {values,dates} = await fundraiser.myDonations({from:donor}) ;
            assert.equal(value,values[0],'donation value must match');
            assert(dates[0],'date should be present');
        });

        it('increases the totalDonations amount', async () => {
            const currentTotalDonations = await fundraiser.totalDonations() ;
            await fundraiser.donate({from:donor,value});
            const newTotalDonations = await fundraiser.totalDonations() ;
            assert.equal(value , newTotalDonations - currentTotalDonations , 'value must add to totalDonations');
        });

        it('increases the donation count', async () => {
            const currentDonationCount = await fundraiser.donationCount() ;
            await fundraiser.donate({from:donor,value});
            const newDonationCount = await fundraiser.donationCount() ;
            assert.equal(1, newDonationCount - currentDonationCount,'donation count should increase by 1');
        });
        
        it('emits DonationREceoved event',async()=>{
            const tx = await fundraiser.donate({from:donor,value});
            const expectedEvent = "DonationReceived" ;
            const actualEvent = tx.logs[0].event ;
            assert.equal(actualEvent,expectedEvent,'event should match');
        });
    });

    describe('withdrawing funds', async () => {
        beforeEach( async() => {
            await fundraiser.donate({from:accounts[2], value:web3.utils.toWei('0.12')}) ;
        });
    });

    describe('access controls',() => {
        it('throws an error if funds withdraw from non-owner account', async () => {
            try {
                await fundraiser.withdraw({from:accounts[3]}) ;
                assert.fail('withdraw was not restricted to owners');
            } catch (error) {
                const expectedError = "Ownable: caller is not the owner";
                const actualError = error.reason;
                assert.equal(actualError,expectedError,'should not be permitted');
            }
        });

        it('permits owner to withdraw funds',  async() => {
            try {
                await fundraiser.withdraw({from:owner});
                assert(true,'no errors were throwsn');
            } catch (error) {
                assert.fail('should not have thrown an error');
            };
        });

        it('transfers balance to beneficiary', async()=>{
            const currentContractBalance = await web3.eth.getBalance(fundraiser.address);
            const currentBeneficiaryBalance = await web3.eth.getBalance(beneficiary);
            await fundraiser.withdraw({from:owner});
            const newbenefeciaryBalance = await web3.eth.getBalance(beneficiary) ;
            const newContractBalance = await web3.eth.getBalance(fundraiser.address);
            assert.equal(newContractBalance,0,'contract balance should be zero');
            assert.equal(currentContractBalance,newbenefeciaryBalance-currentBeneficiaryBalance,'all funds should be sent to beneficiary');
        });

        it('emits WithdrawFunds event', async() => {
            const tx = await fundraiser.withdraw({from:owner});
            const expectedEvent = "WithdrawFunds";
            const actualEvent = tx.logs[0].event ;
            assert.equal(actualEvent,expectedEvent,'event should match');
        });
    });

    describe('fallback function', () => {
        const  value = web3.utils.toWei('0.1234');
        it('increases the totalDonations amount', async () => {
            const currentTotalDonations = await fundraiser.totalDonations() ;
            await  web3.eth.sendTransaction({to:fundraiser.address,from:accounts[9],value});
            const newTotalDonations = await fundraiser.totalDonations() ;
            assert.equal(newTotalDonations-currentTotalDonations, value,'funds should add to totalDonations');
        });
        it('increases the donationCount', async() => {
            const currentDonationCount = await fundraiser.donationCount() ;
            await web3.eth.sendTransaction({to:fundraiser.address , from:accounts[9], value }) ;
            const newDonationCount = await fundraiser.donationCount() ;
            assert.equal(newDonationCount - currentDonationCount , 1 , 'donationCount should increase by 1');
        });
    });
});