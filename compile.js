const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

console.log("-----------compiling contract-------------");

// delete build folder
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

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
fs.ensureDirSync(buildPath);

//loop over all contracts and put them in separate file
for (let contractName in output.contracts["Campaign.sol"]) {
  fs.outputJSONSync(
    path.resolve(buildPath, `${contractName}.json`),
    output.contracts["Campaign.sol"][contractName]
  );
}

console.log("------------Compiled successfully------------");
console.log("------------preparing for deploy-------------");
