import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'
import { configureChains, createClient, WagmiConfig, chain } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const avalanche = chain.avalanche

const { chains, provider } = configureChains(
  [avalanche],
  [jsonRpcProvider({ rpc: () => ({ http: 'https://api.avax.network/ext/bc/C/rpc' }) })]
)

const { connectors } = getDefaultClient({ appName: 'AVAX CHRONICLES', chains })

const wagmiClient = createClient({ autoConnect: true, connectors, provider })

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <ConnectKitProvider>
        <App />
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>
)
