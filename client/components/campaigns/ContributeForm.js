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
import Loader from "../../components/UI/Loader";

const ContributeForm = (props) => {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(false);
    try {
      if (amount === "") {
        throw new Error("Please enter a amount");
      }
      if (isNaN(Number(amount))) {
        throw new Error("Invalid amount of WEI");
      }

      if (Number(amount) <= props.min) {
        throw new Error(`You must contribute greater than ${props.min} ETH`);
      }
      setLoading(true);

      await props.onSubmit(amount);
      setLoading(false);
      setSuccess(true);
      setAmount("");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div>
      <h3 className='py-3'>Contribute</h3>
      {!loading && error && (
        <Alert variant='danger' onClose={() => setError(null)} dismissible>
          <h5>error!</h5>
          <p>{error}</p>
        </Alert>
      )}
      {!loading && success && (
        <Alert variant='success' onClose={() => setSuccess(false)} dismissible>
          <h5>Success</h5>
          <p className='my-0'>Contribution successful!</p>
        </Alert>
      )}

      {loading && <Loader />}
      <Form className='mb-5' onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId='ether'>
          <Form.Label>Enter amount (in Eth) to contribute</Form.Label>
          <InputGroup>
            <Form.Control
              disabled={loading}
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
              type='text'
              placeholder='Enter amount in Eth'
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
          {loading ? "Contributing..." : "Contribute"}
        </Button>
      </Form>
    </div>
  );
};

export default ContributeForm;
