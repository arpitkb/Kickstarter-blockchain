import "../styles/globals.css";

import "../styles/bootstrapLux.min.css";
import Layout from "../components/Layout/Layout";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <script
        src='https://kit.fontawesome.com/87084144ae.js'
        strategy='lazyOnload'
      ></script>
    </>
  );
}

export default MyApp;
