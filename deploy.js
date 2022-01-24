const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const Factory = require("./build/CampaignFactory.json");
const path = require("path");
const fs = require("fs-extra");
require("dotenv").config();

let provider = new HDWalletProvider({
  mnemonic: {
    phrase: process.env.mnemonicPhrase,
  },
  providerOrUrl: process.env.rinkebyURL,
});

const web3 = new Web3(provider);

const deploy = async () => {
  // Get a list of all accounts
  const accList = await web3.eth.getAccounts();

  console.log("-----------Attempting to deploy the contract---------");

  const contract = await new web3.eth.Contract(Factory.abi)
    .deploy({
      data: Factory.evm.bytecode.object,
    })
    .send({
      from: accList[0],
      gas: "2000000",
    });

  //check to see if build directory exist, if not than create

  const buildPath = path.resolve(__dirname, "build");
  fs.ensureDirSync(buildPath);

  fs.outputJSONSync(path.resolve(buildPath, `address.json`), {
    address: contract.options.address,
  });

  console.log("Contract deployed successfully to ", contract.options.address);
};
deploy();
