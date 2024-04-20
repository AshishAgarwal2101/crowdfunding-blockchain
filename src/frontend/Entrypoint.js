import { useEffect, useState } from "react";
import Web3 from "web3";
import Marketplace from '../abis/Marketplace.json';

const Entrypoint = (props) => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [randomStr, setRandomStr] = useState("");

    const connectMetamask = async (e) => {
        e.stopPropagation();
        await loadWeb3();
        await loadBlockchain();
    };

    const loadWeb3 = async () => {
        if (window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            await window.ethereum.request({ method: 'eth_accounts' });
            const newWeb3 = new Web3(window.ethereum);
            setWeb3(newWeb3);
            console.log("newWeb3: ", web3);
            await window.ethereum.enable();
        }
        else if (window.web3) {
            const newWeb3 = new Web3(window.web3.currentProvider);
            setWeb3(newWeb3);
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    };

    const loadBlockchain = async () => {
        if(!web3) return;
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts && accounts.length > 0 ? accounts[0] : null);
        const networkId = await web3.eth.net.getId();
        const networkData = Marketplace.networks[networkId];
        if(networkData) {
            const marketplace = new web3.eth.Contract(Marketplace.abi, networkData.address);
            setContract(marketplace);
            setRandomStr(await marketplace.methods.getRandomString().call());
            console.log(marketplace);
        } else {
            window.alert('Marketplace contract not deployed to detected network.')
        }
    };

    // useEffect(async () => {
    //     await loadWeb3();
    //     await loadBlockchain();
    // }, []);

    return (
        <div>
            <button onClick={connectMetamask}>Connect to Metamask</button>
            <div>HAHAHA</div>
            <div>Random String: {randomStr}</div>
        </div>
    );
};

export default Entrypoint;