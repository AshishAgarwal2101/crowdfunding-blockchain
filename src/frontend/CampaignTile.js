import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Tooltip from '@mui/material/Tooltip';
import Drawer from '@mui/material/Drawer';
import { useState } from 'react';

const CampaignTile = (props) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [funding, setFunding] = useState(0);

    const tileStyle = props.skipVoteIcons ? {height: "270px"} : {};

    const trimContent = (content, len = 200) => {
        if (content.length <= len) {
            return content;
        } else {
            return content.slice(0, len) + "...";
        }
    };

    const onShowCampaign = (e) => {
        e.stopPropagation();
        setDrawerOpen(true);
    };

    const description = "EcoRevive is a comprehensive campaign aimed at revitalizing local ecosystems through community engagement and sustainable practices. The project focuses on restoring biodiversity, combating climate change, and promoting environmental stewardship. Through tree planting initiatives, habitat restoration projects, and educational workshops, EcoRevive empowers individuals to take an active role in preserving and enhancing their natural surroundings. By fostering a sense of environmental responsibility and collective action, the campaign seeks to create lasting positive impacts on both the local environment and the community as a whole.";

    const onVoteClick = async(e, isPositive) => {
        e.stopPropagation();
        try {
            await props.contract.methods
                .vote(props.id, isPositive)
                .send({from: props.account});
            alert("Vote given");
        } catch(e) {
            alert("Voting failed. Make sure you are not the campaign owner and the campaign is not in CREATED state");
        }
    };

    const getVoteItems = () => {
        return (
            <>
                <hr/>
                <div className="positive-vote vote" onClick={e => onVoteClick(e, true)}>
                    <Tooltip title="Vote positive for this campaign">
                        <ThumbUpIcon fontSize="small"/>
                    </Tooltip>
                    <p>{props.positiveVotes.toString()} positive votes</p>
                </div>
                <div className="negative-vote vote" onClick={e => onVoteClick(e, false)}>
                    <Tooltip title="Vote negative for this campaign">
                        <ThumbDownIcon fontSize="small"/>
                    </Tooltip>
                    
                    <p>{props.negativeVotes.toString()} negative votes</p>
                </div>
            </>
        );
    };

    const getEthValue = (funds) => {
        return parseInt(funds.toString()) / 1000000000.0;
    }

    const onClickFundCampaign = async(e) => {
        e.stopPropagation();
        if(funding <= 0) {
            alert("Please enter a positive funding amount");
            return;
        }

        try {
            await props.contract.methods
                .fundCampaign(props.id)
                .send({from: props.account, value: funding * 1000000000000000000}); //ETH to wei
        } catch(e) {
            alert("Something went wrong. Make sure you have enough funds to donate");
        }
    };

    const onClickWithdrawCampaignFunds = async(e) => {
        e.stopPropagation();
        try {
            await props.contract.methods
                .withdrawCampaignFunds(props.id)
                .send({from: props.account});
        } catch(e) {
            alert("Something went wrong. Make sure you are the owner of the campaign");
        }
    };

    const onClickWithdrawFailedCampaignFunds = async(e) => {
        e.stopPropagation();
        try {
            await props.contract.methods
                .withdrawIncompleteCampaignFundedAmount(props.id)
                .send({from: props.account});
        } catch(e) {
            alert("Something went wrong. Make sure you have donated funds to the campaign");
        }
    };

    const getDrawer = () => {
        return (
            <div className="sidebar">
                <div className="campaign-name">
                    {props.name} {props.completedState ? <span>{props.completedState}</span> : ""}
                </div>
                <div className="campaign-target"><b>Target: </b> <span>{getEthValue(props.targetFunds)}</span> ETH</div>
                <div className="campaign-funded"><b>Funds received: </b> <span>{getEthValue(props.currFunds)}</span> ETH</div>
                <div className="campaign-description">{props.description}</div>
                {props.skipVoteIcons ? "" : getVoteItems()}

                {props.state === 1n && props.owner !== props.account ? 
                    <div>
                        <input type="text" placeholder="Funding in ETH" onChange={(e) => {setFunding(parseFloat(e.target.value))}} />
                        <input type="submit" value="Fund campaign" onClick={onClickFundCampaign}/>
                    </div> : ""
                }

                {props.state === 2n && props.owner === props.account ? 
                    <div>
                        <input type="submit" value="Withdraw completed campaign funds" onClick={onClickWithdrawCampaignFunds}/>
                    </div> : ""
                }

                {props.state === 3n && props.owner !== props.account ? 
                    <div>
                        <input type="submit" value="Withdraw failed campaign funds" onClick={onClickWithdrawFailedCampaignFunds}/>
                    </div> : ""
                }
            </div>
        )
    };

    return (
        <>
            <div className="campaign-tile" style={tileStyle} onClick={onShowCampaign}>
                <div className="campaign-name">
                    {props.name} {props.completedState ? <span>{props.completedState}</span> : ""}
                </div>
                <div className="campaign-target"><b>Target: </b> <span>{getEthValue(props.targetFunds)}</span> ETH</div>
                <div className="campaign-funded"><b>Funds received: </b> <span>{getEthValue(props.currFunds)}</span> ETH</div>
                <div className="campaign-description">{trimContent(props.description)}</div>
                {props.skipVoteIcons ? "" : getVoteItems()}
            </div>
            <Drawer open={isDrawerOpen} onClose={() => {setDrawerOpen(false)}}>
                {getDrawer()}
            </Drawer>
        </>
        
    );
};

export default CampaignTile;