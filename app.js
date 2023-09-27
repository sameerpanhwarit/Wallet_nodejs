const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const uri = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1';
const client = new MongoClient(uri);
client.connect()
const db = client.db("Wallet");
const collection = db.collection('Wallets');


const port = 3000; 
  
app.set('view engine', 'ejs');

app.get('/create', (req, res) => {
    res.render('index'); 
});

//Create wallet Endpoint
app.post('/create',(req,res)=>{
  wallet = {
    "WalletId": generateRandom9DigitNumber(),
    "profileId": generateRandom9DigitNumber(),
    "currentBalance": 0,
    "status": "Activate",
    "currency": "CA",
    "countryCode":"+1"
}

   const result = collection.insertOne(wallet);
   console.log("Wallet Created Successfully.")
})

app.get('/credit',(req,res)=>{
    res.render("credit")
})

//credit funds to wallet
app.post('/credit', async (req, res) => {
    const walletId = parseInt(req.body.id,10);
    const amount = parseFloat(req.body.amount);
    const Filter = { "WalletId": walletId }; 
    try{
    const wt = await collection.findOne(Filter)
    let walletBalance = parseFloat(wt.currentBalance);
    let updateBalance = walletBalance+=amount;
    let updte = collection.updateOne(
        {"WalletId": walletId},{
            $set:{"currentBalance": updateBalance}
        }
    )
    console.log("Amount Credited.")}

    catch(err){
        console.log("Wallet not Found")
    }

});

app.get('/debit',(req,res)=>{
    res.render("debit")
})


//Debit funds from wallet
app.post('/debit', async (req, res) => {
    const walletId = parseInt(req.body.id,10);
    const amount = parseFloat(req.body.amount);
    const Filter = { "WalletId": walletId }; 
    try{
    const wt = await collection.findOne(Filter)
    let walletBalance = parseFloat(wt.currentBalance);
    if(walletBalance<amount){
        console.log("Insufficent Amount")
    }
    else{
        let updateBalance = walletBalance-=amount;
    let updte = collection.updateOne(
        {"WalletId": walletId},{
            $set:{"currentBalance": updateBalance}
        }
    
    )
    }
       console.log("Amount Debited.")}
    catch(err){
        console.log("Got Some errors")
    }

});


//this function generate walletID and profileID
function generateRandom9DigitNumber() {
    const min = 100000000; 
    const max = 999999999; 
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

app.get('/wallet/:profileId', async(req,res)=>{
    const {profileId}= req.params;
    const Filter = {"profileId":parseInt(profileId,10)};
    const result = await collection.findOne(Filter)
    res.render("wallet", {wallet: result})

})

// Start the server
app.listen(port, () => {
    console.log('Server is running on port');
});