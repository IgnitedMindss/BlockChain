// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22;

// creating the contract
contract Voting{
    //creating structure for the candicate
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }

    // use mapping to fetch the candidate details
    mapping(uint => Candidate) public candidates;

    // to save the list of users/accounts who already casted votes
    mapping(address => bool) public voters;

    // adding a public state variable to keep track of count of candidates
    uint public candidatesCount;

    constructor() public{
        addCandidate("Peter");
        addCandidate("Stewie");
    }

    // func to add the candidates
    function addCandidate (string memory name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, name, 0);
    }

    function vote (uint candidateID) public {
        candidates[candidateID].voteCount++;
        voters[msg.sender] = true;
    }
}