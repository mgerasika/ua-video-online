import type { AppProps } from 'next/app'
import GlobalStyles from '../styles/GlobalStyles'
import 'twin.macro'
import Head from 'next/head'

const App = ({ Component, pageProps }: AppProps) => (
  <div tw="bg-black min-h-screen">
    <Head>
      <div
        style={{
          zIndex: '0',
          marginTop: '-16px',
          minHeight: '0px !important',
        }}
        id="cdnplayer"
      ></div>
      <script type="text/javascript" src="/static/eval-code.js"></script>
      {/* <script type="text/javascript" src="/static/script.601.js"></script> */}
      <script type="text/javascript" src="/static/execute-player.js"></script>
    </Head>
    <GlobalStyles />
    <Component {...pageProps} />
  </div>
)

export default App
