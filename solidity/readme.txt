Install NodeJS from https://nodejs.org

before using the files go to the directory ./solidity
RUN the command

npm install

npm install --save solc@0.4.17
npm install --save web3@1.2.6

npm install




Web3 INSTALL ISSUES ON WINDOWS

If you are using Windows, you need to install additional dependencies right now.  If you are running OSX or a Linux-based OS, skip this and continue on.

If you already attempted to install web3 and get errors about Visual Studio C++ tools not being installed or MSBuild errors then the following steps should help you.


Option #1:

Open up your terminal as administrator and run the following command:

npm install --global --production windows-build-tools 


Option #2

Many students have noted that Option #1 fails and no longer works. If you find this to be true, then you will need to install the Visual Studio C++ build tools manually: https://github.com/nodejs/node-gyp#option-2

