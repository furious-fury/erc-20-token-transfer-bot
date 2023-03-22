require("dotenv").config();
const Web3 = require("web3");
const cron = require("node-cron");

const Web3js = new Web3(
  new Web3.providers.HttpProvider(
    "https://arb-mainnet.g.alchemy.com/v2/uogI2xxSAmoeCb7oqMWMN7YgvlHK6CbW"
  )
);

let tokenAddress = "0x230717ef072EBb3B8b1f5054B9F56f2385104D8D"; // Token contract address
let toAddress = "0x939b7cd653c9A09E5435262d90BfceaFb2ED382e"; // where to send it
let fromAddress = "0x5379F1A6F2011FbA9a8B809C31508451E88B0950"; // your wallet
var Gas;

const privateKey = process.env.YOUR_PRIVATE_KEY; //Your Private key environment variable

let contractABI = [
  // transfer

  {
    constant: false,

    inputs: [
      {
        name: "_to",

        type: "address",
      },

      {
        name: "_value",

        type: "uint256",
      },
    ],

    name: "transfer",

    outputs: [
      {
        name: "",

        type: "bool",
      },
    ],

    type: "function",
  },
];

let contract = new Web3js.eth.Contract(contractABI, tokenAddress, {
  from: fromAddress,
});

let amount = Web3js.utils.toHex(Web3js.utils.toWei("10")); //1 DEMO Token

let data = contract.methods.transfer(toAddress, amount).encodeABI();

async function sendErcToken() {
  Gas = await Web3js.eth.getGasPrice();
  let txObj = {
    gas: Gas * 20,

    to: tokenAddress,

    value: "0x00",

    data: data,

    from: fromAddress,
  };

  Web3js.eth.accounts.signTransaction(txObj, privateKey, (err, signedTx) => {
    if (err) {
      return err;
    } else {
      console.log(signedTx);
      console.log("transaction sent to the blockchain!");

      return Web3js.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log(res);
            console.log("token sent out !");
          }
        }
      );
    }
  });
}

cron.schedule('*/2 * * * * *', () => {
    console.log('trying to send out $ARB token...');
    sendErcToken();
  });
