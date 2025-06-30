# Crowdfunding Blockchain

A decentralized crowdfunding platform built on Ethereum. Users can create, fund, and vote on crowdfunding campaigns using smart contracts. The platform features a React frontend that interacts with the blockchain via Web3 and MetaMask. Campaigns have funding goals and durations, and users can vote to approve campaigns before fundraising begins. Funds are managed securely through the smart contract, and withdrawals are based on campaign outcomes.


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
* Install Node.js v20.11.0: https://nodejs.org
* ```npm install```

## Running:
* ```npm run compile```
* ```npm run migrate```
* ```npm start```
* Open http://localhost:3000 in a browser where metamask is installed.