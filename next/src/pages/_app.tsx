import type { AppProps } from 'next/app'
import GlobalStyles from '../styles/GlobalStyles'
import 'twin.macro'

const App = ({ Component, pageProps }: AppProps) => (
  <div tw="bg-black min-h-screen">
    <div
      style={{
        zIndex: '0',
        marginTop: '-16px',
        minHeight: '0px !important',
      }}
      id="cdnplayer"
      tw="mb-4"
    ></div>
    <GlobalStyles />
    <Component {...pageProps} />

    <script type="text/javascript" src="/static/eval-code.js" defer></script>
    <script
      type="text/javascript"
      src="/static/execute-player.js"
      defer
    ></script>
  </div>
)

export default App
