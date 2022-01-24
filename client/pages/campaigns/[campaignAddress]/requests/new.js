import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Form,
  Image,
  InputGroup,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { getInstance } from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";
import Loader from "../../../../components/UI/Loader";
import Link from "next/link";
import Head from "next/head";

const regex = /^0x[a-fA-F0-9]{40}$/;

const NewRequest = () => {
  const router = useRouter();
  const { campaignAddress } = router.query;
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    setError(null);
    try {
      if (description.length < 25) {
        throw new Error("Description too short, write atleast 25 chars long");
      }
      if (amount === "") {
        throw new Error("Please enter amount");
      }
      if (isNaN(Number(amount))) {
        throw new Error("Invalid amount of ETH");
      }

      if (!regex.test(recipient)) {
        throw new Error("Recipients address not valid");
      }

      setLoading(true);
      const accs = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const campaign = getInstance(campaignAddress);
      const manager = await campaign.methods.manager().call();
      if (accs[0] !== manager.toLowerCase()) {
        throw new Error("Only manager can create the requests");
      }
      await campaign.methods
        .createRequest(
          description,
          web3.utils.toWei(amount, "ether"),
          recipient
        )
        .send({
          from: accs[0],
        });

      router.replace(`/campaigns/${campaignAddress}/requests`);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <>
      <Head>
        <title>Create Request | Kickstarter</title>
        <meta
          name='description'
          content='Create a payment request for you campaign'
        />
      </Head>
      <div>
        <h3 className='py-3'>Create a Request</h3>
        {!loading && error && (
          <Row>
            <Col md={8}>
              <Alert
                variant='danger'
                onClose={() => setError(null)}
                dismissible
              >
                <Alert.Heading>Error!</Alert.Heading>
                <p className='m-0'>{error}</p>
              </Alert>
            </Col>
          </Row>
        )}

        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group className='mb-3' controlId='desc'>
            <Form.Label>Set Request description</Form.Label>

            <Form.Control
              style={{ height: "100px" }}
              disabled={loading}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              as='textarea'
              placeholder='Please write a description of atleast 25 chars'
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='ether'>
            <Form.Label>Request amount (ETH)</Form.Label>
            <InputGroup>
              <Form.Control
                disabled={loading}
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
                type='text'
                placeholder='Enter amount'
              />
              <InputGroup.Text>
                <i className='fab fa-ethereum'></i>
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group className='mb-3' controlId='rec'>
            <Form.Label>Enter Recipient</Form.Label>

            <Form.Control
              disabled={loading}
              onChange={(e) => setRecipient(e.target.value)}
              value={recipient}
              type='text'
              placeholder='Enter address'
            />
          </Form.Group>
          <div className='mt-4'>
            <Button disabled={loading} type='submit' variant='success'>
              {loading ? (
                "Creating..."
              ) : (
                <>
                  Create<i className='fas fa-plus ms-2'></i>
                </>
              )}
            </Button>
            {!loading && (
              <Link href={`/campaigns/${campaignAddress}/requests`}>
                <a className='btn btn-info'>Go back</a>
              </Link>
            )}
          </div>
        </Form>
      </div>
    </>
  );
};

export default NewRequest;
