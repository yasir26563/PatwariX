const HDWalletProvider= require('truffle-hdwallet-provider');
const Web3= require('web3');
const {interface, bytecode}= require('../compile');

const provider= new HDWalletProvider(   //add private key here to sign transactions
    'glance inform cactus narrow negative turn grit mom soon repair assault sound',
    'https://rinkeby.infura.io/v3/bc9f0a0f50c04156be54a5d68fe4184b'
);

const web3= new Web3(provider);     //unlocking the account using seed and a gateway to ethereum network

//variables used as parameters


const transact = async () =>{

    const accounts= await web3.eth.getAccounts();   //keeping sub accounts of unlocked account

    console.log('Attempting to buyerSign from account', accounts[0]);

    //const contract_Address="<ADD DEPLOYED ADDRESS HERE>";
    const contract_Address="0xF8C410d28848644328540DDF74E17c970ab8b6d5";
    const contract = await new web3.eth.Contract(JSON.parse(interface), contract_Address);

    const result= await contract.methods.cancelTransactionByAuthority().send({
        from: accounts[0]
        //gas: '1000000'
    });

    //console.log(result);
    console.log('Contract hash on address ', result.options.address)

};

transact();