// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22;

// creating the contract
contract Voting{
    //creating structure for the candicate
    struct Candidate{
        uint id;
        string name;
        uint voteCounts;
    }

    // use mapping to fetch the candidate details
    mapping(uint => candidate) public candidates;

    // adding a public state variable to keep track of count of candidates
    uint public candidatesCount;

    // func to add the candidates
    function addCandidate(string _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }
}