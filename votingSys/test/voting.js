var Voting = artifacts.require("./Voting.sol");

contract("Voting", function(accounts){

    // checking if initialised correctly
    it("initializes with two candidates", function(){
        return Voting.deployed().then(function(instance){
            return instance.candidatesCount();
        }).then(function(count){
            assert.equal(count, 2);
        });
    });

    it("it initializes the candidates with the correct values", function(){
        return Voting.deployed().then(function(instance){
            candidateInstance = instance;
            return candidateInstance.candidates(1);
        }).then(function(candidate){
            assert.equal(candidate[0], 1, "has the correct id");
            assert.equal(candidate[1], "Peter", "has the correct name");
            assert.equal(candidate[2], 0, 0, "has the correct vote count");
            return candidateInstance.candidates(2);
        }).then(function(candidate){
            assert.equal(candidate[0], 2, "has the correct id");
            assert.equal(candidate[1], "Stewie", "has the correct name");
            assert.equal(candidate[2], 0, 0, "has the correct vote count");
        });
    });

});
