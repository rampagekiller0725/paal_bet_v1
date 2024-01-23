import { PageInfo, TokenType } from "./interfaces";
import sUSDAbi from '@/@core/abi/tokens/sUSD.json';
import ETHAbi from '@/@core/abi/tokens/ETH.json';
import DAIAbi from '@/@core/abi/tokens/DAI.json';
// import OPAbi from '@/@core/abi/tokens/OP.json';
import USDCAbi from '@/@core/abi/tokens/USDC.json';
import USDTAbi from '@/@core/abi/tokens/USDT.json';

import { ContractAbi } from "web3";

export const appTitle = 'PaalBot';

export type PageType = 'loading' | 'scheduled' | 'betslip' | 'mybets' | 'connectWallet';

export const pages: {[key in PageType]: PageInfo} = {
  loading: {
    title: `Loading ... | ${appTitle}`,
    path: '/',
  },
  scheduled: {
    title: `Scheduled | ${appTitle}`,
    path: '/scheduled',
  },
  betslip: {
    title: `Betslip | ${appTitle}`,
    path: '/betslip',
  },
  mybets: {
    title: `My Bets | ${appTitle}`,
    path: '/mybets',
  },
  connectWallet: {
    title: `Wallets | ${appTitle}`,
    path: '/connect-wallet',
  },
}

export const tokens: {[key in TokenType]: {
  name: string
  address: `0x${string}`,
  decimals: number,
  abi: ContractAbi
}} = {
  sUSD: {
    name: 'Synth sUSD',
    address: '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9',
    decimals: 18,
    abi: sUSDAbi,
  },
  DAI: {
    name: 'Dai Stablecoin',
    address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    decimals: 18,
    abi: DAIAbi,
  },
  USDC: {
    name: 'USD coin',
    address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    decimals: 6,
    abi: USDCAbi,
  },
  USDT: {
    name: 'Tether USD',
    address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    decimals: 6,
    abi: USDTAbi,
  },
  // OP: {
  //   name: 'Optimism',
  //   address: '0x4200000000000000000000000000000000000042',
  //   decimals: 18,
  //   abi: OPAbi,
  // },
  ETH: {
    name: 'Ethereum',
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
    abi: ETHAbi,
  },
  // WETH: {
  //   name: 'Wrapped Ether',
  //   address: '0x4200000000000000000000000000000000000006',
  //   decimals: 18,
  //   abi: ETHAbi,
  // }
};
