import React, { useState } from "react";
import { getInstance } from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import { Button, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";

const RRow = (props) => {
  const router = useRouter();
  const [loadingf, setLoadingf] = useState(false);
  const [loadinga, setLoadinga] = useState(false);
  const {
    idx,
    req,
    approverCount,
    setLoading,
    setError,
    campaignAddress,
    refreshPage,
  } = props;

  const eligible = parseFloat(100 * (req.approvalCount / approverCount)) >= 50;

  const copyAddress = (data) => {
    const textarea = document.createElement("textarea");
    textarea.innerText = data;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  };

  const approveHandler = async (idx) => {
    try {
      setLoading(true);
      setLoadinga(true);

      const campaign = getInstance(campaignAddress);
      const accs = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      await campaign.methods.approveRequest(idx).send({
        from: accs[0],
      });

      setLoading(false);
      setLoadinga(false);
      refreshPage();
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setLoadinga(false);
    }
  };

  const finalizeHandler = async (idx) => {
    try {
      setLoading(true);
      setLoadingf(true);

      const campaign = getInstance(campaignAddress);
      const accs = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const manager = await campaign.methods.manager().call();
      if (accs[0] != manager.toLowerCase()) {
        throw new Error("Only manager can finalize the request");
      }
      await campaign.methods.finalizeRequest(idx).send({
        from: accs[0],
      });

      setLoading(false);
      setLoadingf(false);
      refreshPage();
    } catch (err) {
      setError(err.message);

      setLoading(false);
      setLoadingf(false);
    }
  };

  return (
    <tr key={idx}>
      <td>{idx}</td>
      <td>{req.description}</td>
      <td>{web3.utils.fromWei(req.value, "ether")}</td>
      <td className='px-0'>
        {req.recipient.substring(0, 8)}...
        <i
          onClick={() => {
            copyAddress(req.recipient);
          }}
          className='fas fa-copy'
        ></i>
      </td>
      <td>
        {req.approvalCount}/{approverCount}
      </td>
      {!req.complete ? (
        <>
          <td className='pe-0'>
            <Button
              disabled={loadinga}
              onClick={() => {
                approveHandler(idx);
              }}
              variant='success'
              size='sm'
            >
              {loadinga ? <Spinner animation='border' size='sm' /> : "Approve"}
            </Button>
          </td>
          <td className='ps-0'>
            <Button
              disabled={loadingf || !eligible}
              onClick={() => {
                finalizeHandler(idx);
              }}
              variant='info'
              size='sm'
            >
              {loadingf ? (
                <Spinner animation='border' size='sm' />
              ) : (
                <>
                  {eligible ? (
                    "Finalize"
                  ) : (
                    <>
                      <i className='fas me-1 fa-exclamation-triangle'></i>
                      Finalize{" "}
                    </>
                  )}{" "}
                </>
              )}
            </Button>
          </td>
        </>
      ) : (
        <td colSpan={2}>
          <Button disabled variant='success'>
            Request completed
          </Button>
        </td>
      )}
    </tr>
  );
};

export default RRow;
