pragma solidity ^0.5.0;

contract Marketplace {
    string public name;

    constructor() public {
        name = "My marketplace";
    }

    function getRandomString() public pure returns(string memory) {
        return "Hello";
    }
}