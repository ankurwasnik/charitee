import Web3 from 'web3' ;

let getWeb3 = new Promise((resolve,reject)=>{
    window.addEventListener('load',function()=>{
        var results ;
        var web3 = window.web3;
        if(typeof web3 !== 'undefined'){
            web3= new Web3(web3.currentProvider);
            results = {
                web3 : web3
            }
            resolve(results);
        }else{
            var provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
            web3 = new Web3(provider);
            results = {
                web3 : web3
            }
            resolve(results);
            
        }
    });
});

export default getWeb3 ;
