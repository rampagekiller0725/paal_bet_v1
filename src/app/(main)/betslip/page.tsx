'use client'

import useAppContext from '@/@core/hooks/useAppContext';
import { useEffect, useState } from 'react';
import { BetType, TokenType } from '@/@core/interfaces';
import { Button, Spinner, Switch } from '@nextui-org/react';
import BetCard from './_components/BetCard/BetCard';
import BetAmountInput from './_components/BetAmountInput/BetAmountInput';
import ServiceFee from './_components/ServiceFee';
import PossibleProfit from './_components/PossibleProfit';
import NoBets from '@/@core/components/NoBets';
import { useAccount } from 'wagmi';
import { useRouter, useSearchParams } from 'next/navigation';
import { queryFrom } from '@/@core/utils/client';
import { buyFromAMM, buyFromAMMWithCollateralAndReferrer, buyFromAMMWithETHAndReferrer, buyFromParlay, buyFromParlayWithDifferentCollateralAndReferrer, buyFromParlayWithEth, getBalance, isApproved } from '@/@core/api/betting';


export default function Betslip() {
  const { data: { positions }, setDataWith } = useAppContext();
  const [betAmount, setBetAmount] = useState('');
  const [betAmounts, setBetAmounts] = useState<{ [key: string]: string | number }>({});
  const [tokenType, setTokenType] = useState<TokenType>('sUSD');
  const [betType, setBetType] = useState<BetType>('parlay');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState({ bet: false, balance: false });
  const [disabled, setDisabled] = useState(true);
  const [approved, setApproved] = useState(false);

  const params = useSearchParams();
  const router = useRouter();

  const account = useAccount();
  const network = params.get('network') ?? 10;

  useEffect(() => {
    const init = async () => {
      setLoading(ld => ({ ...ld, balance: true }));
      const address = account.address;
      const balance = await getBalance(address!, tokenType);
      setBalance(balance);
      setLoading(ld => ({ ...ld, balance: false }));
    }

    if (account.isConnected) {
      init();
    }
  }, [account.isConnected, tokenType]);

  useEffect(() => {
    const setBuyDisabled = () => {
      if (betType === 'parlay' && (+betAmount < 3 || positions.length < 2)) {
        setDisabled(true);
      } else if (betType === 'single' && Object.values(betAmounts).some(value => +value <= 0)) {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    }

    setBuyDisabled();
  }, [betType, betAmount, betAmounts, positions]);

  useEffect(() => {
    const checkIfApproved = async () => {
      if (betType === 'parlay') {
        const approved = await isApproved({ userAddress: account.address!, buyIn: +betAmount, tokenType: tokenType });
        setApproved(approved);
      } else if (betType === 'single') {
        let amount = 0;
        for (const am of Object.values(betAmounts)) {
          amount += +am;
        }
        const approved = await isApproved({ userAddress: account.address!, buyIn: amount, tokenType: tokenType });
        setApproved(approved);
      }
    }

    if (account.isConnected) {
      checkIfApproved();
    }
  }, [account.isConnected, betType, betAmount, betAmounts, tokenType]);

  const setParlayBet = () => {
    setBetType('parlay');
  }

  const setSingleBet = () => {
    setBetType('single');
  }

  const setSingleQuote = (address: string, amount: string | number) => {
    setBetAmounts(am => ({ ...am, [address]: amount }));
    setDataWith(d => {
      let { positions } = d;
      positions = positions.map(p => p.market.address === address ? { ...p, paid: +amount } : p);
      return { ...d, positions };
    });
  }

  const SingleBetAmountChange = (address: string, amount: number | string, tokenType: TokenType) => {
    setSingleQuote(address, amount);
    setTokenType(tokenType);
  }

  const ParlayBetAmountChange = (amount: number | string, tokenType: TokenType) => {
    setBetAmount(amount.toString());
    setTokenType(tokenType);
  }

  const placeBet = async () => {
    if (!account.isConnected) {
      const { query } = queryFrom(params, {});
      router.push(`/connect-wallet/?${query}`);
      return;
    }

    setLoading(loading => ({ ...loading, bet: true }));
    if (betType === 'single') {
      await buySingleBet();
    }

    if (betType === 'parlay') {
      await buyParlayBet();
    }

    setLoading(loading => ({ ...loading, bet: false }));
  }

  const buySingleBet = async () => {
    if (tokenType === 'sUSD') {
      await Promise.all(positions.map(async (pos) => {
        await buyFromAMM({
          networkId: +network,
          userAddress: account.address!,
          marketAddress: pos.market.address,
          position: pos.position,
          buyIn: +pos.paid,
        });
      }));
    } else if (tokenType === 'ETH') {
      await Promise.all(positions.map(async (pos) => {
        await buyFromAMMWithETHAndReferrer({
          networkId: +network,
          userAddress: account.address!,
          marketAddress: pos.market.address,
          position: pos.position,
          buyIn: +pos.paid,
        });
      }));
    } else {
      await Promise.all(positions.map(async (pos) => {
        await buyFromAMMWithCollateralAndReferrer({
          networkId: +network,
          userAddress: account.address!,
          marketAddress: pos.market.address,
          position: pos.position,
          buyIn: +pos.paid,
          tokenType,
        });
      }));
    }
  }

  const buyParlayBet = async () => {
    if (tokenType === 'sUSD') {
      await buyFromParlay({
        networkId: +network,
        userAddress: account.address!,
        marketAddresses: positions.map(p => p.market.address),
        positions: positions.map(p => p.position),
        buyIn: +betAmount,
      });
    } else if (tokenType === 'ETH') {
      await buyFromParlayWithEth({
        networkId: +network,
        userAddress: account.address!,
        marketAddresses: positions.map(p => p.market.address),
        positions: positions.map(p => p.position),
        buyIn: +betAmount,
      });
    } else {
      await buyFromParlayWithDifferentCollateralAndReferrer({
        networkId: +network,
        userAddress: account.address!,
        marketAddresses: positions.map(p => p.market.address),
        positions: positions.map(p => p.position),
        buyIn: +betAmount,
        tokenType: tokenType,
      });
    }
  }

  return (
    <div className="betslip-page">
      {positions.length > 0 &&
        <>
          <div className="bet-type-box">
            <div className="bet-type-label" onClick={setParlayBet}>Parlay</div>
            <Switch isSelected={betType === 'single'} onValueChange={selected => selected ? setBetType('single') : setBetType('parlay')} />
            <div className="bet-type-label" onClick={setSingleBet}>Single</div>
          </div>
          {betType === 'parlay' && (
            <>
              <div className="bet-list">
                {positions.map((p, index) => <BetCard key={index} {...p} />)}
              </div>
              <BetAmountInput value={betAmount} tokenType={tokenType} onChange={(value, tokenType) => ParlayBetAmountChange(value, tokenType)} />
            </>
          )}
          {betType === 'single' &&
            positions.map((p, index) => (
              <div key={index} className='bet-pay-pair'>
                <BetCard {...p} />
                <BetAmountInput value={betAmounts[p.market.address] ?? ''} tokenType={tokenType} onChange={(value, tokenType) => SingleBetAmountChange(p.market.address, value, tokenType)} />
              </div>
            ))
          }

          <div className="balance-box">
            <span>Available balance</span>
            {loading.balance && <Spinner size='sm' />}
            {!loading.balance && (
              <div className='right-box'>
                <span className='amount'>{balance.toFixed(4)}</span>
                <span className='currency'>{tokenType}</span>
              </div>
            )}
          </div>
          <ServiceFee value={12} />
          <PossibleProfit value={13} />
          <Button onClick={placeBet} className='place-button' isLoading={loading.bet} disabled={disabled}>
            {!approved && 'APPROVE'}
            {approved && 'PLACE BET'}
          </Button>
        </>
      }
      {positions.length === 0 && <NoBets />}
    </div>
  )
}