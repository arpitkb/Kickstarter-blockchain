import React from "react";
import Box from "./Box";

import { Alert, Badge } from "react-bootstrap";
import web3 from "../../ethereum/web3";

const CampaignDetails = (props) => {
  const {
    minimumContribution,
    balance,
    requests,
    approversCount,
    manager,
    description,
  } = props.data;

  return (
    <>
      <div className='d-flex flex-wrap justify-content-center justify-content-xl-start'>
        <Box
          attribute='Balance'
          value={
            <span>
              {web3.utils.fromWei(balance, "ether")}{" "}
              <i className='fab fa-ethereum'></i>
            </span>
          }
        />
        <Box
          attribute='Min. Contribution'
          value={`${minimumContribution} wei`}
        />
      </div>
      <div className='d-flex flex-wrap  justify-content-center justify-content-xl-start'>
        <Box attribute='Requests' value={requests} />
        <Box attribute='Contributors' value={approversCount} />
      </div>
    </>
  );
};

export default CampaignDetails;
