const path= require('path');
const fs=  require('fs');
const solc= require('solc');

const patwarixPath= path.resolve(__dirname, 'contracts', 'patwarix.sol');
const source = fs.readFileSync(patwarixPath, 'utf8');

//console.log(source);
console.log(solc.compile(source, 1).contracts[':Property']);

module.exports = solc.compile(source, 1).contracts[':Property'];

//  TODO: use precompiled code for more performance