# Crowdfunding Blockchain

## Setting up Ganache
* Install Ganache: https://archive.trufflesuite.com/ganache/
* Set up a quick ethereum network

## Setting up Metamask
* Intall metamask extension: https://metamask.io/
* Open the extension and add a new network:
    * Network Name: LocalGanache
    * New RPC URL: http://127.0.0.1:7545
    * Chain ID: 1337
    * Currency Symbol: ETH
* Set up ganache account key(s):
    * Copy the private key of an account from Ganache.
    * Add an account to metamask with this key.

## Setting up react and node
* Install Node.js v20.11.0: https://nodejs.org/dist/v20.11.0/win-x64/node.exe
* ```npm install```

## Running:
* ```npm run truffle-compile```
* ```npm run truffle-migrate```
* ```npm start```
* Open http://localhost:3000 in a browser where metamask is installed.