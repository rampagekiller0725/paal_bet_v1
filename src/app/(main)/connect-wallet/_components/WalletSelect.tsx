import { Wallet } from '@/@core/interfaces';
import Image from 'next/image';

interface Props {
  wallet: Wallet
  onClick: () => void
  disabled: boolean
}

export default function WalletSelect({ wallet, onClick, disabled }: Props) {
  return (
    <div className="wallet-select" onClick={disabled? undefined : onClick} style={disabled ? {backgroundColor: 'gray'} : undefined}>
      <Image src={wallet.imageUrl} alt='image' className='wallet-image' width={100} height={100} />
      <span className='wallet-title'>{wallet.name}</span>
    </div>
  )
}