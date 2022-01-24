import React, { useState } from "react";
import Head from "next/head";
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
import factory from "../../ethereum/factory";
import Loader from "../../components/UI/Loader";

const CreateCamapign = () => {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    setError(null);
    try {
      if (amount === "") {
        throw new Error("Please set minimum contribution");
      }
      if (isNaN(Number(amount))) {
        throw new Error("Invalid amount of WEI");
      }
      if (description.length < 50) {
        throw new Error("Description too short, write atleast 50 chars long");
      }
      setLoading(true);
      const accs = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      await factory.methods.createCampaign(amount, description).send({
        from: accs[0],
      });

      router.replace("/");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <>
      <Head>
        <title>New Campaign | Kickstarter</title>
        <meta name='description' content='Create your campaign' />
      </Head>
      <div>
        <h3 className='py-3'>New campaign</h3>
        {!loading && error && (
          <Row>
            <Col md={8}>
              <Alert
                variant='danger'
                onClose={() => setError(null)}
                dismissible
              >
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>{error}</p>
              </Alert>
            </Col>
          </Row>
        )}

        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group className='mb-3' controlId='desc'>
            <Form.Label>Set Campaign description</Form.Label>

            <Form.Control
              style={{ height: "100px" }}
              disabled={loading}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              as='textarea'
              placeholder='Please write a description of atleast 50 chars'
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='ether'>
            <Form.Label>Set Minimum contribution (in Wei)</Form.Label>
            <InputGroup>
              <Form.Control
                disabled={loading}
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
                type='text'
                placeholder='Enter amount in Wei'
              />
              <InputGroup.Text>
                <Image
                  fluid
                  src='https://img.icons8.com/color/25/000000/ethereum.png'
                />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Button disabled={loading} type='submit' variant='success'>
            {loading ? (
              "Creating..."
            ) : (
              <>
                Create
                <i className='ms-2 fas fa-plus'></i>
              </>
            )}
          </Button>
        </Form>
      </div>
    </>
  );
};

export default CreateCamapign;
