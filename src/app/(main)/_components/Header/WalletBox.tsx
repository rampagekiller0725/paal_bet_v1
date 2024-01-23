'use client'

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { queryFrom } from '@/@core/utils/client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import My from '@/@core/components/Button';
import { useDisconnect } from 'wagmi';
import { useRef, useState } from 'react';
import useTouchElse from '@/@core/hooks/useTouchElse';
import { Spinner } from '@nextui-org/react';


export default function WalletBox() {
  const params = useSearchParams();
  const { params: searchParams } = queryFrom(params, {});
  const [contentVisible, setContentVisible] = useState(false);

  const buttonRef = useRef<any>();
  const contentRef = useRef<any>();

  const dis = useDisconnect();

  const disconnect = () => {
    dis.disconnect();
    setContentVisible(false);
  }

  useTouchElse(buttonRef, contentRef, contentVisible, () => setContentVisible(false));

  return (
    <ConnectButton.Custom>
      {({
        mounted,
        authenticationStatus,
        account,
        chain,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div>
            {connected && (
              <>
                <My.Button className="balance-box" onClick={() => setContentVisible(true)} ref={buttonRef}>
                  {chain.iconUrl && chain.name && <Image src={chain.iconUrl} alt={chain.name} className='balance-image' width={100} height={100} />}
                  <span className='chain-name'>{`${account.address.substring(0, 4)}...${account.address.substring(account.address.length - 4, account.address.length)}` ?? 'No chain'}</span>
                </My.Button>
                {contentVisible && (
                  <div className="disconnect-box" onClick={() => setContentVisible(false)}>
                    <My.Button className='disconnect-button' onClick={disconnect} ref={contentRef}>
                      Disconnect
                    </My.Button>
                  </div>
                )}
              </>
            )}
            {!connected && !mounted && (
              <div className='wallet-box'>
                Checking ... <Spinner size='sm' style={{marginLeft: '.5rem'}} />
              </div>
            )}
            {!connected && mounted && (
              <Link className="wallet-box" href={{ pathname: '/connect-wallet', query: searchParams }}>
                Connect Wallet
              </Link>
            )}
          </div>
        )
      }}

    </ConnectButton.Custom>
  )
}