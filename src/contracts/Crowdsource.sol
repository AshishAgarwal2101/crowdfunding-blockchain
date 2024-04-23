pragma solidity ^0.5.0;

contract Crowdsource {
    string public constant symbol = "ETH";
    string public constant name = "Crowdsouring platform";
    address authorized;
    uint private lastId;

    enum CampaignState { CREATED, FUNDRAISING, COMPLETE, INCOMPLETE }
    struct Campaign {
        uint id;
        string description;
        uint targetFunds; //in gwei (1 ETH = 10^9 gwei)
        uint campaignEndTime;
    }

    mapping(uint => Campaign) campaignMap;
    mapping(uint => CampaignState) campaignStates;

    constructor() public {
        authorized = msg.sender;
        lastId = 0;
    }

    //duration is in days
    function createCampaign(string memory description, uint targetFunds, uint duration) public {
        require(targetFunds > 10000000, "Minimum target must be 0.01 ETH");
        require(duration > 10, "Minimum duration must be 10 days");

        Campaign memory campaign = Campaign(
            ++lastId, 
            description, 
            targetFunds, 
            block.timestamp + (duration * 24 * 60 * 60)
        );

        campaignMap[lastId] = campaign;
        campaignStates[lastId] = CampaignState.CREATED;
    }

    function getRandomString() public pure returns(string memory) {
        return "Hello";
    }
}