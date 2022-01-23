import Head from "next/head";
import { Card, Row, Col, Button } from "react-bootstrap";
import factory from "../ethereum/factory";
import Link from "next/link";

function HomePage(props) {
  return (
    <>
      <Head>
        <title>Homepage</title>
        <meta name='description' content='Browse a list of campaigns' />
      </Head>
      <div className='d-flex justify-content-between align-items-center'>
        <h4 className='text-center'>Open campaigns</h4>

        <Link href='/campaigns/new'>
          <Button>Create campaign</Button>
        </Link>
      </div>
      <Row>
        {props.campaigns.map((el) => (
          <Col key={el} xs={12} md={9}>
            <Card className='mt-3'>
              {/* <Card.Header></Card.Header> */}
              <Card.Body>
                <div className='py-2'>{el}</div>
                <Link href={`/campaigns/${el}`}>
                  <Button size='sm' variant='info'>
                    View campaign
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}

export async function getStaticProps() {
  const camps = await factory.methods.getDeployedCampaigns().call();

  return { props: { campaigns: camps } };
}

export default HomePage;
