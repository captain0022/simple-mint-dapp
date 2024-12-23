import { http, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import {
  coinbaseWallet,
  injected,
  walletConnect,
  metaMask,
} from 'wagmi/connectors';

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
