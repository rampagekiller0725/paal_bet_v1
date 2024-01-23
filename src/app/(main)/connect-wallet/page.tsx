'use client'

import BackButton from "@/@core/components/BackButton";
import { Wallet } from "@/@core/interfaces"
import WalletSelect from './_components/WalletSelect';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { WalletButton } from '@rainbow-me/rainbowkit';

const wallets: Wallet[] = [
  {
    name: 'MetaMask',
    type: 'metamask',
    imageUrl: '/assets/images/metamask.png',
  },
  // {
  //   name: 'Trust Wallet',
  //   type: WalletType.TrustWallet,
  //   imageUrl: '/assets/images/trustwallet.png',
  // },
  {
    name: 'Coinbase',
    type: 'coinbase',
    imageUrl: '/assets/images/coinbase.jpg',
  },
  {
    name: 'Rainbow',
    type: 'rainbow',
    imageUrl: '/assets/images/rainbow.jpg',
  }
];

export default function Page() {
  const router = useRouter();
  
  return (
    <div className="connect-wallet-page">
      <div className="top-box">
        <BackButton onClick={() => router.back()} />
        <span className="title">Available Wallets</span>
      </div>
      <div className="content-box">
        {wallets.map((wallet, index) => (
          <WalletButton.Custom key={index} wallet={wallet.type}>
            {({ready, connect}) => (
              <WalletSelect onClick={connect} wallet={wallet} disabled={!ready} />
            )}
          </WalletButton.Custom>
        ))}
      </div>
    </div>
  )
}