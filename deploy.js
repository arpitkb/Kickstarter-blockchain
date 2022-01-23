const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const Factory = require("./build/CampaignFactory.json");

const mnemonicPhrase =
  "melody worth inject food moment only cousin before fiscal lounge sail better"; // 12 word mnemonic

let provider = new HDWalletProvider({
  mnemonic: {
    phrase: mnemonicPhrase,
  },
  providerOrUrl:
    "https://rinkeby.infura.io/v3/1fb49a4010ea418da65fb4698fdbf58f",
});

const web3 = new Web3(provider);

const deploy = async () => {
  // Get a list of all accounts
  const accList = await web3.eth.getAccounts();

  console.log("-----------Attempting to deploy the contract---------");
  console.log("Account used = ", accList[0]);

  const contract = await new web3.eth.Contract(Factory.abi)
    .deploy({
      data: Factory.evm.bytecode.object,
    })
    .send({
      from: accList[0],
      gas: "2000000",
    });

  console.log("Contract deployed successfully to ", contract.options.address);
};
deploy();
