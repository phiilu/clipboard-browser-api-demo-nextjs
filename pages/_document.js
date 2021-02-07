import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          <script
            async
            defer
            data-domain="clipboard-api.phiilu.com"
            src="https://p.phiilu.com/js/plausible.js"></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
