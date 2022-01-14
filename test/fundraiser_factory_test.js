const FundraiserFactoryContract = artifacts.require("FundraiserFactory");

contract("FundraiserFactory : deployment",()=>{
    it('has been deployed', async()=>{
        const fundraiserFactory = await FundraiserFactoryContract.deployed() ;
        assert(fundraiserFactory,'fundraiserFactory was not deployed');
    });
});

contract("FundraiserFactory : createFundraiser", (accounts)=>{
    let fundraiserFactory ;
    //fundraisers arg
    const name = "Beneficiary Name";
    const url = "beneficiary.org";
    const imageUrl = "https://placekitten.com/600/400";
    const description = "Beneficiary descripition";
    const beneficiary = accounts[1] ;

    it('increments the fundraiserCount', async () => {
        fundraiserFactory = await FundraiserFactoryContract.deployed();
        const currentFundraiserCount = await fundraiserFactory.fundraisersCount() ;
        await fundraiserFactory.createFundraiser(
            name,
            url,
            imageUrl,
            description,
            beneficiary,
        );
        const newFundraiserCount = await fundraiserFactory.fundraisersCount() ;
        assert.equal(newFundraiserCount - currentFundraiserCount, 1,'a new fundraiser should be created');
    });
    it('emits FundraiserCreated event', async() => {
        fundraiserFactory = await FundraiserFactoryContract.deployed();
        const tx = await fundraiserFactory.createFundraiser(
            name,
            url,
            imageUrl,
            description,
            beneficiary,
        );
        const exprectedEvent = "FundraiserEvent" ;
        const actualEvent = tx.logs[0].event ;
        assert.equal(actualEvent,exprectedEvent,'event should match');
    });
});