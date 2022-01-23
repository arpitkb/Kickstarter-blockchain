import React from "react";
import CampaignDetails from "../../../components/campaigns/CampaignDetails";
import { getInstance } from "../../../ethereum/campaign";
import { useRouter } from "next/router";
import Loader from "../../../components/UI/Loader";
import { Alert, Col, Row } from "react-bootstrap";
import ContributeForm from "../../../components/campaigns/ContributeForm";
import web3 from "../../../ethereum/web3";
import Link from "next/link";

const Campaign = (props) => {
  const router = useRouter();

  const refreshPage = () => {
    router.replace(router.asPath);
  };

  const onContribute = async (amt) => {
    console.log(amt);
    const campaign = getInstance(props.address);
    const accs = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    await campaign.methods.contribute().send({
      from: accs[0],
      value: web3.utils.toWei(amt, "ether"),
    });
    refreshPage();
  };

  if (router.isFallback) {
    return <Loader />;
  }

  return (
    <>
      <h3>Campaign details</h3>
      <Alert variant='warning'>
        Manager Address :{" "}
        <div className='manager d-md-inline'> {props.manager}</div>
      </Alert>
      <Alert className='py-4 mt-4' variant='success'>
        {props.description}
      </Alert>
      <Row>
        <Col md={6}>
          <CampaignDetails data={props} />
          <Link href={`/campaigns/${props.address}/requests`}>
            <a className='btn mt-3 mb-5 btn-primary'>View Requests</a>
          </Link>
        </Col>
        <Col md={6}>
          <ContributeForm
            onSubmit={onContribute}
            min={web3.utils.fromWei(props.minimumContribution, "ether")}
          />
        </Col>
      </Row>
    </>
  );
};

export async function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          campaignAddress: "0xfef615168ac98ef15709d2E3281F6449CBeB6C2d",
        },
      },
    ],
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const { campaignAddress } = context.params;
  const campaign = getInstance(campaignAddress);
  const summary = await campaign.methods.getSummary().call();
  return {
    props: {
      minimumContribution: summary[0],
      balance: summary[1],
      requests: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      description: summary[5],
      address: campaignAddress,
    },
    revalidate: 1,
  };
}

export default Campaign;
