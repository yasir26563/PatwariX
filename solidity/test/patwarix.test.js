const assert= require('assert');
const ganache= require('ganache-cli'); //auto boots when required
const Web3= require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

let property;
let accounts;

const pType= 'House';
const pAddress= 'House 1, street 1, F-10/3';
const pCity= 'Islamabad';
const pSizeInSquareFeet= '5200';
const pLongitude= '73.047882';
const pLatitude= '33.684422';

beforeEach(async ()=>{
    accounts = await web3.eth.getAccounts();

    property =  await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode, arguments: [pType,pAddress,pCity,pSizeInSquareFeet,pLongitude,pLatitude] })
    .send({ gas: '1000000', from: accounts[0] }); 
});

describe('Property Contract', ()=>{

    it('Deploys a Contract', ()=>{
        assert.ok(property.options.address);
    });

});