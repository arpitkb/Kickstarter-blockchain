const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

// delete build folder
const buldPath = path.resolve(__dirname, "build");
fs.removeSync(buldPath);

const contractPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(contractPath, "utf-8");

const input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["evm.bytecode", "abi"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

//check to see if build directory exist, if not than create
fs.ensureDirSync(buldPath);

//loop over all contracts and put them in separate file
for (let contractName in output.contracts["Campaign.sol"]) {
  fs.outputJSONSync(
    path.resolve(buldPath, `${contractName}.json`),
    output.contracts["Campaign.sol"][contractName]
  );
}

console.log("Compiled successfully...");
