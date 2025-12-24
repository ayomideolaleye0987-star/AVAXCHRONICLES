import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'
import { configureChains, createConfig, WagmiConfig, chain } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const avalanche = chain.avalanche

const { chains, publicClient } = configureChains(
  [avalanche],
  [jsonRpcProvider({ rpc: () => ({ http: 'https://api.avax.network/ext/bc/C/rpc' }) })]
)

const wagmiConfig = createConfig(getDefaultClient({ appName: 'AVAX CHRONICLES', chains, publicClient }))

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider chains={chains}>
        <App />
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>
)
