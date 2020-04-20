const HDWalletProvider= require('truffle-hdwallet-provider');
const Web3= require('web3');
const {interface, bytecode}= require('./compile');

const provider= new HDWalletProvider(
    'glance inform cactus narrow negative turn grit mom soon repair assault sound',
    'https://rinkeby.infura.io/v3/bc9f0a0f50c04156be54a5d68fe4184b'
);

const web3= new Web3(provider);     //unlocking the account using seed and a gateway to ethereum network

const pType= 'Flat';
const pAddress= 'Building Arcade, street 1, F-10/3';
const pCity= 'Islamabad';
const pSizeInSquareFeet= '500';
const pLatitude= '33.684422';
const pLongitude= '73.047882';

const deploy = async () =>{
    const accounts= await web3.eth.getAccounts();   //keeping sub accounts of unlocked account

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [pType,pAddress,pCity,pSizeInSquareFeet,pLatitude,pLongitude] })
    .send({ gas: '1000000', from: accounts[0] });

    //console.log(result);
    console.log('Contract deployed to address ', result.options.address)

};

deploy();