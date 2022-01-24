import web3 from "./web3";
import CampaignFactory from "../../build/CampaignFactory.json";
import add from "../../build/address.json";

const instance = new web3.eth.Contract(CampaignFactory.abi, add.address);

export default instance;
