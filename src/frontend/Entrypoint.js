import { useEffect, useState } from "react";
import Web3 from "web3";
import Crowdsource from '../abis/Crowdsource.json';

const Entrypoint = (props) => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [randomStr, setRandomStr] = useState("");

    useEffect(() => {
        loadWeb3();
    }, []);

    useEffect(() => {
        loadBlockchain();
    }, [web3]);

    const loadWeb3 = async () => {
        if (window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            await window.ethereum.request({ method: 'eth_accounts' });
            const newWeb3 = new Web3(window.ethereum);
            setWeb3(newWeb3);
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
        const networkData = Crowdsource.networks[networkId];
        if(networkData) {
            const crowdsource = new web3.eth.Contract(Crowdsource.abi, networkData.address);
            setContract(crowdsource);
            setRandomStr(await crowdsource.methods.getRandomString().call());
            //console.log("Crowdsource", crowdsource);
        } else {
            window.alert('Crowdsource contract not deployed to detected network.')
        }
    };

    return (
        <div>
            <div>HAHAHA</div>
            <div>Random String: {randomStr}</div>
        </div>
    );
};

export default Entrypoint;