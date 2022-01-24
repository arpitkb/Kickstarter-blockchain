import Web3 from "web3";
import { url } from "./rinkeyby";

let web3;

if (typeof window !== "undefined" && (window.ethereum || window.web3)) {
  // We are in browser
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
  } else if (window.web3) {
    web3 = new Web3(Web3.givenProvider);
  }
} else {
  const provider = new Web3.providers.HttpProvider(
    // your rinkeby testnet node url
    url
  );
  web3 = new Web3(provider);
}

export default web3;
