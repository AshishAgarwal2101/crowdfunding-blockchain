pragma solidity ^0.5.0;

contract Crowdsource {
    string public name;

    constructor() public {
        name = "My crowdsouring platform";
    }

    function getRandomString() public pure returns(string memory) {
        return "Hello";
    }
}