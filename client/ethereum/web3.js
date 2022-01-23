import Web3 from "web3";

let web3;
// web3 = new Web3(window.web3.currentProvider);

if (typeof window !== "undefined" && (window.ethereum || window.web3)) {
  // We are in browser
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
  } else if (window.web3) {
    web3 = new Web3(Web3.givenProvider);
  }
} else {
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/1fb49a4010ea418da65fb4698fdbf58f"
  );
  web3 = new Web3(provider);
}

export default web3;
