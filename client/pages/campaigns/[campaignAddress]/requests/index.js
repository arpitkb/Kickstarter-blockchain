import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Alert, Badge, Button, Table } from "react-bootstrap";

import { getInstance } from "../../../../ethereum/campaign";
import Loader from "../../../../components/UI/Loader";
import RRow from "../../../../components/Request/RRow";

const Requests = () => {
  const router = useRouter();
  //   console.log(router);
  const [requests, setRequests] = useState([]);
  const [num, setNum] = useState(0);
  const [approverCount, setApproverCount] = useState(0);
  const { campaignAddress } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (campaignAddress) {
      const fetchData = async () => {
        setLoading(true);
        const campaign = getInstance(campaignAddress);
        const apCount = await campaign.methods.approversCount().call();
        setApproverCount(apCount);
        const n = await campaign.methods.numRequests().call();
        setNum(n);
        const requests = [];
        for (let i = 0; i < n; i++) {
          const req = await campaign.methods.requests(i).call();
          requests.push(req);
        }
        //   console.log(requests);
        setRequests(requests);
        setLoading(false);
      };
      fetchData();
    }
  }, [campaignAddress, refresh]);

  const refreshPage = () => {
    setRefresh(!refresh);
  };

  return (
    <>
      <div className='d-flex justify-content-between'>
        <h3>
          Requests <Badge bg='info'>{num}</Badge>{" "}
        </h3>

        {loading && <Loader />}
        <Link href={`/campaigns/${campaignAddress}/requests/new`}>
          <a className='btn btn-info'>Create request</a>
        </Link>
      </div>
      {!loading && error && (
        <Alert
          className='p-2 mt-2'
          variant='danger'
          onClose={() => setError(null)}
          dismissible
        >
          <Alert.Heading>Error!</Alert.Heading>
          <p className='m-0'>{error}</p>
        </Alert>
      )}

      <Table responsive hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th className='ps-0'>Amount (ETH)</th>
            <th className='px-0'>Recipient</th>
            <th>Approvals</th>
            <th>Approve</th>
            <th>Finalize</th>
          </tr>
        </thead>
        <tbody>
          {requests &&
            requests.map((req, idx) => (
              <RRow
                key={idx}
                setLoading={setLoading}
                setError={setError}
                req={req}
                idx={idx}
                approverCount={approverCount}
                campaignAddress={campaignAddress}
                loading={loading}
                refreshPage={refreshPage}
              />
            ))}
        </tbody>
      </Table>
      <Link href={`/campaigns/${campaignAddress}`}>
        <a className='btn btn-primary'>Go back</a>
      </Link>
    </>
  );
};

export default Requests;
