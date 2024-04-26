pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Crowdsource {
    string public constant symbol = "ETH";
    string public constant name = "Crowdsouring platform";
    address authorized;
    uint private lastId;
    uint target = 3;

    enum CampaignState { CREATED, FUNDRAISING, COMPLETE, INCOMPLETE }
    struct Campaign {
        uint id;
        address owner;
        string description;
        uint targetFunds; //in gwei (1 ETH = 10^9 gwei)
        uint campaignEndTime;
        uint currFunds;
        uint positiveVotes;
        uint negativeVotes;
        CampaignState state;
    }

    mapping(uint => Campaign) campaignMap;
    mapping(uint => mapping(address => bool)) voterDetails;


    constructor() public {
        authorized = msg.sender;
        lastId = 0;
    }

    //duration is in days
    function createCampaign(string memory description, uint targetFunds, uint duration) public {
        require(targetFunds >= 10000000, "Minimum target must be 0.01 ETH");
        require(duration > 10, "Minimum duration must be 10 days");

        Campaign memory campaign = Campaign(
            ++lastId,
            msg.sender,
            description, 
            targetFunds, 
            block.timestamp + (duration * 24 * 60 * 60),
            0,
            0,
            0,
            CampaignState.CREATED
        );

        campaignMap[lastId] = campaign;
    }

    function getCampaigns() public view returns (Campaign[] memory campaigns) {
        Campaign[] memory campaignArr = new Campaign[](lastId);
        for (uint256 i = 1; i <= lastId; i++) {
            campaignArr[i - 1] = campaignMap[i];
        }
        return campaignArr;
    }

    function fundCampaign(uint campaignId) public payable {
        require(msg.value > 0, "No ether was sent as part of transfer");
        require(campaignMap[campaignId].id == campaignId, "Invalid campaign ID");
        require(campaignMap[campaignId].state == CampaignState.FUNDRAISING);

        campaignMap[campaignId].currFunds += msg.value;
        if(campaignMap[campaignId].currFunds >= campaignMap[campaignId].targetFunds) {
            campaignMap[campaignId].state == CampaignState.COMPLETE;
        }
    }

    function getRandomString() public pure returns(string memory) {
        return "Hello";
    }

    function vote(uint256 campaignId, bool vote) public {
        require(voterDetails[campaignId][msg.sender] == false,"Double Voting");
        require(campaignMap[campaignId].state == CampaignState.CREATED,"Campaign is no longer in created stage");
        if(vote){
            campaignMap[campaignId].positiveVotes += 1;
        }
        else{
             campaignMap[campaignId].negativeVotes += 1;
        }
        voterDetails[campaignId][msg.sender] = true;

        uint diff = campaignMap[campaignId].positiveVotes - campaignMap[campaignId].negativeVotes;
        if (diff>=target){
            campaignMap[campaignId].state = CampaignState.FUNDRAISING;
        }
        
    }

    function getCampaign(uint256 campaignId) public view returns(Campaign memory campaign)  {
        return campaignMap[campaignId];

    }

}