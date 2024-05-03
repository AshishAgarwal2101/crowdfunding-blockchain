import { useEffect, useState } from "react";
import Web3 from "web3";
import Crowdsource from '../abis/Crowdsource.json';
import CampaignTile from './CampaignTile';
import CreateCampaignTile from './CreateCampaignTile';

const Entrypoint = (props) => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [currNavbar, setCurrNavbar] = useState("myCampaigns");
    const [campaigns, setCampaigns] = useState({"owned": [], "created": [], "fundraising": [], "completed": [], "incomplete": []});

    useEffect(() => {
        loadWeb3();
    }, []);

    useEffect(() => {
        if(!contract) loadBlockchain();
    }, [web3]);

    useEffect(() => {
        if(contract && account) {
            getCampaigns();
        }
    }, [contract, account]);

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
        console.log("Accounts: ", accounts);
        setAccount(accounts && accounts.length > 0 ? accounts[0] : null);
        const networkId = await web3.eth.net.getId();
        const networkData = Crowdsource.networks[networkId];
        if(networkData) {
            const crowdsource = new web3.eth.Contract(Crowdsource.abi, networkData.address);
            setContract(crowdsource);
        } else {
            window.alert('Crowdsource contract not deployed to detected network.')
        }
    };

    const createCampaign = async (name, description, targetFunds, duration) => {
        try {
            const currCampaigns = {...campaigns};
            await contract.methods.createCampaign(name, description, targetFunds, duration).send({from: account});
            const newCampaign = {
                    id: currCampaigns.length > 0 ? currCampaigns[currCampaigns.length-1].id + 1 : 1,
                    name,
                    owner: account,
                    description,
                    targetFunds,
                    campaignEndTime: 42343434343432423,
                    currFunds: 0,
                    positiveVotes: 0,
                    negativeVotes: 0,
                    state: 0
                };
            currCampaigns["owned"].push(newCampaign);
            currCampaigns["created"].push(newCampaign);

            categorizeAndSetCampaigns(currCampaigns);
            setCampaigns(currCampaigns);
        } catch(e) {
            console.log("Create error: ", e);
        }
    }

    const categorizeAndSetCampaigns = (currCampaigns) => {
        const ownedCampaigns = currCampaigns.filter(campaign => campaign?.owner === account);
        const createdCampaigns = currCampaigns.filter(campaign => campaign?.state === 0n);
        const fundraisingCampaigns = currCampaigns.filter(campaign => campaign?.state === 1n);
        const completedCampaigns = currCampaigns.filter(campaign => campaign?.state === 2n);
        const incompleteCampaigns = currCampaigns.filter(campaign => campaign?.state === 3n);

        setCampaigns({
            "owned": ownedCampaigns,
            "created": createdCampaigns,
            "fundraising": fundraisingCampaigns,
            "completed": completedCampaigns,
            "incomplete": incompleteCampaigns
        });
    };

    const getCampaigns = async () => {
        try {
            const currCampaigns = await contract.methods.getCampaigns().call();
            if(currCampaigns && Array.isArray(currCampaigns)) categorizeAndSetCampaigns(currCampaigns);
        } catch(e) {
            console.log("error: ", e);
        }
    };

    const getCampaignTiles = (campaigns, skipVote = true, showCompleted = false) => {
        const getCompletedState = campaign => (showCompleted ? (campaign.state === 2n ? "Complete" : "Incomplete") : null);

        return campaigns.map((campaign) => {
            return (
                <CampaignTile
                    contract={contract}
                    account={account}
                    skipVoteIcons={skipVote}
                    completedState={getCompletedState(campaign)}
                    id={campaign.id}
                    name={campaign.name}
                    description={campaign.description}
                    owner={campaign.owner}
                    targetFunds={campaign.targetFunds}
                    currFunds={campaign.currFunds}
                    positiveVotes={campaign.positiveVotes}
                    negativeVotes={campaign.negativeVotes}
                    state={campaign.state}
                />
            );
        });
        
    }

    const getNavbarComponents = () => {
        if(currNavbar === "myCampaigns") {
            return (
                <>
                    <CreateCampaignTile 
                        fontSize="large" 
                        skipVoteIcons={true}
                        createCampaign={createCampaign}
                    />
                    {getCampaignTiles(campaigns["owned"], true)}
                </>
            );
        } else if (currNavbar === "openCampaigns") {
            return (
                <>
                    {getCampaignTiles(campaigns["created"], false)}
                </>
            );
        } else if (currNavbar === "fundedCampaigns") {
            return (
                <>
                    {getCampaignTiles(campaigns["fundraising"], true,)}
                </>
            );
        } else {
            return (
                <>
                    {getCampaignTiles([...campaigns["completed"], ...campaigns["incomplete"]], true, true)}
                </>
            );
        }
    };

    return (
        <div>
            <div className="header">
                <h1>EmpowerFund: A decentralized crowdfunding platform</h1>
                <p>Account: {account}</p>
            </div>
            <div className="navbar">
                <a onClick={(e) => {setCurrNavbar("myCampaigns")}}>My campaigns</a>
                <a onClick={(e) => {setCurrNavbar("openCampaigns")}}>Open campaigns</a>
                <a onClick={(e) => {setCurrNavbar("fundedCampaigns")}}>Funded campaigns</a>
                <a onClick={(e) => {setCurrNavbar("compIncompCampaigns")}}>Complete/Incomplete campaigns</a>
            </div>
            <div className="row">
                <div className="main">
                    {getNavbarComponents()}
                </div>
            </div>
        </div>
    );
};

export default Entrypoint;