import web3 from "./web3";
import CampaignFactory from "../../build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0x07CbBD188f80656fC92008a5B2766e34fB1e2EBe"
);

export default instance;
