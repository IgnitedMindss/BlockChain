const SHA256 = require("crypto-js/sha256"); // SHA256 cryptographic function to generate the hash for block

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp, transactions, prevHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.prevHash = prevHash;
        this.hash = this.calcHash();
        this.nonce = 0;
    }

    calcHash(){
        // SHA256 will return an object which will convert to string with toString
        return SHA256(this.timestamp+this.prevHash+JSON.stringify(this.transactions)+this.nonce).toString();
    }

    mineNewBlock(difficulty){ // difficulty is the number of 0s in front (for proof of work)
        while(this.hash.substring(0, difficulty) != Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calcHash();
        }
        // console.log("new hash :"+this.hash);
    }

}

class Blockchain{
    constructor(){
        // first value in the array is genesisBlock create manually
        this.chain = [this.createGenesisBlock()]; // contains genesis block obj
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 10;
    }

    createGenesisBlock(){
        return new Block(Date.now().toString(), "Secret transactions1","0");
    }

    //Steps for creating block for blockchain:
    // new block obj (1) -> need hash of the previous block (2) -> calc hash of current block (3)
    getPrevBlock(){
        return this.chain[this.chain.length-1]; // return previous block obj
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getPrevBlock().hash);
        block.mineNewBlock(this.difficulty);
        console.log("Block mined successfully");

        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward) // in place of null sys address should be there
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance = balance - trans.amount;
                }
                if(trans.toAddress === address){
                    balance = balance + trans.amount;
                }
            }
        }

        return balance;
    }

    //------------------- addBlock is not used in crypt ------------------------------
    addBlock(new_Block){ // (1)
        new_Block.prevHash = this.getPrevBlock().hash; // (2)
        // new_Block.hash = new_Block.calcHash(); // (3)
        new_Block.mineNewBlock(this.difficulty); // (new 3)
        this.chain.push(new_Block);
    }
    // -------------------------------------------------------------------------------

    isBlockchainValid(){ //checking if the block is tampered or not
        for(let i = 1; i<this.chain.length; i++){
            const currBlock = this.chain[i];
            const prevBlock = this.chain[i-1];

            //Check: if currBlock hash is tampered or not (1), if currBlock prev_hash is equal to the prevBlock hash (2)

            if(currBlock.hash !== currBlock.calcHash()){ //(1)
                return false;
            }

            if(currBlock.prevHash !== prevBlock.hash){ // (2)
                return false;
            }

        }
        return true;
    }
}

let uCoin = new Blockchain();
transaction1 = new Transaction("Brain", "Stewie", 100);
uCoin.createTransaction(transaction1);

transaction2 = new Transaction("Stewie", "Brain", 30);
uCoin.createTransaction(transaction2);

console.log("miner started mining: ");
uCoin.minePendingTransactions("Chris");

console.log("balance for Brain is: "+uCoin.getBalanceOfAddress("Brain"));
console.log("balance for Stewie is: "+uCoin.getBalanceOfAddress("Stewie"));
console.log("balance for Chris is: "+uCoin.getBalanceOfAddress("Chris"));

console.log("miner started mining again: ");
uCoin.minePendingTransactions("Chris");

console.log("balance for Chris is: "+uCoin.getBalanceOfAddress("Chris"));





// creating blocks
// let block1 = new Block(1, Date.now().toString(), {pass : "Peter_123"});
// let block2 = new Block(2, Date.now().toString(), {pass : "Stewie@#546"});

// creating a block chain
// let myBlockchain = new Blockchain();

// adding blocks to the block chain
// myBlockchain.addBlock(block1);
// myBlockchain.addBlock(block2);

// viewing block cahin obj with JSON stringify
// console.log(JSON.stringify(myBlockchain, null, 4));
// console.log("Validation check: "+myBlockchain.isBlockchainValid());

// // lets say a hacker is trying to tamper the pass
// myBlockchain.chain[1].transactions = {pass : "Stewie123"};


// console.log(JSON.stringify(myBlockchain, null, 4));
// console.log("Validation check: "+myBlockchain.isBlockchainValid());

// console.log(Array(5).join("0"));
// console.log("Hello".substring(0, 4));
