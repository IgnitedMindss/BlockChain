App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (typeof web3 !== 'undefined'){
      // If web3 instance is already provided by meta mask
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance is provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Voting.json", function(voting) {
      //Instaniate a new truffle contract from the artifact
      App.contracts.Voting = TruffleContract(voting);
      //Connect provider to interact with contract
      App.contracts.Voting.setProvider(App.web3Provider);

    return App.render();
  });
  },

    render: function(){
      var votingInstance;
      var loader = $("#loader");
      var content = $("#content");

      loader.show();
      content.hide();

      // Load account data
      web3.eth.getCoinbase(function(err, account) {
        if (err === null){
          App.account = account;
          $("#accountAddress").html("Your Account: " + account);
        }
      });

      // Load contract data
      App.contracts.Voting.deployed().then(function(instance){
        votingInstance = instance;
        return votingInstance.candidatesCount();
      }).then(function(candidatesCount){
        var candidatesResults = $("#candidatesResults");
        candidatesResults.empty();

        var candidatesSelect = $("#candidatesSelect");
        candidatesResults.empty();

          for(var i = 1; i <= candidatesCount; i++){
            votingInstance.candidates(i).then(function(candidate){
              var id = candidate[0];
              var name = candidate[1];
              var voteCount = candidate[2];

              // Render condidate Result
              var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
              candidatesResults.append(candidateTemplate);

              // Render candidate voting options
              var candidateOption = "<option value='" + id + "' >" + name + "</option>"
              candidatesSelect.append(candidateOption);
            });
          }

          loader.hide();
          content.show();
      }).catch(function(error){
        console.warn(error);
      });
    },

    castVote: function(){
      var candidateId = $('#candidatesSelect').val();
      App.contracts.Voting.deployed().then(function(instance){
        return instance.vote(candidateId, {from: App.account});
      }).then(function(result){
        // Wait for vote to update
        $("#content").hide();
        $("#loader").show();
      }).catch(function(err){
        console.log(err);
      });
    }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
