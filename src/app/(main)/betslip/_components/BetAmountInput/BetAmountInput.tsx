'use client'

import { TokenType } from '@/@core/interfaces';
import SelectorButton from './SelectorButton';
import TokenSelect from './TokenSelect';

interface Props {
  value: number | string
  tokenType: TokenType
  onChange: (value: number | string, token: TokenType) => void
}

export default function BetAmountInput({ value, tokenType, onChange }: Props) {
  return (
    <div className="bet-amount-input">
      <div className="input-part">
        <input type='number' value={value} onChange={(e) => onChange(e.target.value, tokenType)} placeholder='Bet Amount' autoFocus />
        <span className='suffix'>
          <TokenSelect tokenType={tokenType} onChange={tokenValue => onChange(value, tokenValue)} />
        </span>
      </div>
      <div className="selector">
        <SelectorButton value={20} onClick={() => onChange(20, tokenType)} />
        <SelectorButton value={50} onClick={() => onChange(50, tokenType)} />
        <SelectorButton value={200} onClick={() => onChange(200, tokenType)} />
        <SelectorButton value={1000} onClick={() => onChange(1000, tokenType)} />
        <SelectorButton title='Max' onClick={() => onChange(25000, tokenType)} />
      </div>
    </div>
  )
}