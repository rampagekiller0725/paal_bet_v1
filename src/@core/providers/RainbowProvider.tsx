'use client'

import { ReactNode } from "react";

import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
} from 'wagmi/chains';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora],
  [
    // alchemyProvider({ apiKey: 'f64ee662b83340f2b42fd9e4d4314ab1'}),
    alchemyProvider({ apiKey: 'lBfe-rz3J8NLNwmNpMOdH3jtCUEJNX0w'}), // key = ?
    publicProvider(),
  ],
);

const { connectors } = getDefaultWallets({
  appName: 'paal',
  projectId: 'b428e443c4c2e1efcfeb7bae216ced4c', // = ?
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function RainbowProvider(props: {children: ReactNode}) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        {props.children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}