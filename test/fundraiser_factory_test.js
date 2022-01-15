const FundraiserFactoryContract = artifacts.require("FundraiserFactory");
const FundraiserContract = artifacts.require("Fundraiser");

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
contract('FundraiserFactory : fundraisers',(accounts)=>{
    async function createFundraiserFactory(fundraiserCount, accounts){
        const factory = await FundraiserFactoryContract.new();
        await addFundraisers(factory,fundraiserCount,accounts);
        return factory ;
    }
    async function addFundraisers(factory,count,accounts){
        const name = "Beneficiary";
        const lowerCaseName = name.toLowerCase();
        const beneficiary = accounts[1];
        const owner = accounts[0];
        for(let i=0; i<count; i++){
            await factory.createFundraiser(
            `${name} ${i}` ,
            `${lowerCaseName}${i}.com`,
            `${lowerCaseName}${i}.png`,
            `Description for ${name} ${i}`,
            beneficiary
            );
        }
    }
    describe('when fundraisers collection is empty',()=>{
        it('returns an empty collection', async()=>{
            const factory = await createFundraiserFactory(0,accounts);
            const fundraisers = await factory.fundraisers(10,0);
            assert.equal(
                fundraisers.length,
                0,
                'collection should be empty'
            );
        });
    });

    describe('varying limits',()=>{
        let factory ;
        beforeEach(async()=>{
            factory = await createFundraiserFactory(30,accounts);
        });

        it('returns 10 results when limit requested is 10', async()=>{
            const fundraisers = await factory.fundraisers(10,0);
            assert.equal(
                fundraisers.length,
                10,
                'result size should be 10'
            );
        });

        it('returns 20 results when limit requested is 20', async()=>{
            const fundraisers = await factory.fundraisers(20,0);
            assert.equal(
                fundraisers.length,
                20,
                'result size should be 20'
            );
        });

        it('returns 20 results when limit requested is 30', async()=>{
            const fundraisers = await factory.fundraisers(30,0);
            assert.equal(
                fundraisers.length,
                20,
                'result size should be 20'
            );
        });
    });

    describe('varying offset',()=>{
        let factory ;
        beforeEach(async()=>{
            factory = await createFundraiserFactory(10,accounts);
        });

        it('contains the fundraiser with the appropriate offset',async()=>{
            const fundraisers = await factory.fundraisers(1,0);
            const fundraiser = await FundraiserContract.at(fundraisers[0]);
            const name = await fundraiser.name();
            assert.ok(
                await name.includes(0),
                `${name} did not include the offset`
            );
        });
        it('contains the fundraiser with the appropriate offset',async()=>{
            const fundraisers = await factory.fundraisers(1,7);
            const fundraiser = await FundraiserContract.at(fundraisers[0]);
            const name = await fundraiser.name();
            assert.ok(
                await name.includes(7),
                `${name} did not include the offset`
            );
        });
    });
    describe('boundary conditions',()=>{
        let factory ;
        beforeEach(async()=>{
            factory = await createFundraiserFactory(10,accounts);
        });
        it('raises out of bounds error',async()=>{
            try{
                await factory.fundraisers(1,11);
                assert.fail('error was not raised');
            }
            catch(error){
                const expected = "offset out of bounds";
                assert.ok(
                    error.message.includes(expected),
                    `${error.message}`
                );
            }
        });
        it('raises out of bounds error',async()=>{
            try{
                const fundraisers = await factory.fundraisers(10,5);
                assert.equal(
                   fundraisers.length,
                    5,
                    'collection adjusted'
                );
            }
            catch(error){
                assert.fail(
                    'limit and offset exceeded bounds'
                );
            }
        });
    });
});
