import dotenv from 'dotenv';
import { Field } from '../enums';
import { TokenType } from '../interfaces';
import { tokens } from '../constants';
import Web3, { ContractAbi } from 'web3';
import { getParlayQuote, getSingleQuote } from './overtime';
import { ethers } from 'ethers';
import { Address, parseUnits } from 'viem';
import { readContract, prepareWriteContract, writeContract } from '@wagmi/core';

import sportsAMMAbi from '@/@core/abi/sportsAMMContractAbi.json';
import parlayAMMAbi from '@/@core/abi/parlayAMMContractAbi.json';
import quotingAbi from '@/@core/abi/quotingContractAbi.json';

import singleMarketAbi from '@/@core/abi/singleMarket.json';


dotenv.config();

// const API_URL = 'https://api.thalesmarket.io';
// const NETWORK_ID = Network.Optimism;
// const NETWORK: NetworkType = 'optimism';
const SPORTS_AMM_CONTRACT_ADDRESS = '0x170a5714112daEfF20E798B6e92e25B86Ea603C1';
const PARLAY_AMM_CONTRACT_ADDRESS = '0x82B3634C0518507D5d817bE6dAb6233ebE4D68D9';
const QUOTING_CONTRACT_ADDRESS = '0x6F5A76423396Bf39F64F8c51C0B3dEb24990b116';

const SLIPPAGE = 0.02;


export const getBalance = async (userAddress: Address, tokenType: TokenType) => {
  if (tokenType === 'ETH'/*  || tokenType === 'WETH' */) {
    const web3provider = new Web3.providers.HttpProvider('https://optimism.meowrpc.com');
    const web3 = new Web3(web3provider);
    const data = await web3.eth.getBalance(userAddress);
    const balance = Number(data) / (10 ** tokens.ETH.decimals);
    return balance;
  }

  const token = tokens[tokenType];
  const tx = await readContract({
    address: token.address,
    abi: token.abi as ContractAbi,
    functionName: 'balanceOf',
    args: [userAddress],
  });

  const balance = Number(tx) / (10 ** token.decimals);
  return balance;
}

type IsApproved = (data: { userAddress: Address, buyIn: number, tokenType: TokenType }) => Promise<boolean>;
type ConfirmApproved = (data: { userAddress: Address, buyIn: number, tokenType: TokenType }) => Promise<void>;
type BuyFromAMM = (data: { networkId: number, userAddress: Address, marketAddress: Address, position: Field, buyIn: number }) => Promise<void>;
type BuyFromAMMWithCollateralAndReferrer = (data: {
  networkId: number, userAddress: Address, marketAddress: Address,
  tokenType: TokenType, position: Field, buyIn: number
}) => Promise<void>;
type BuyFromAMMWithETHAndReferrer = (data: {
  networkId: number, userAddress: Address, marketAddress: Address, position: Field, buyIn: number
}) => Promise<void>;
type EtherTo = (data: { etherAmount: number, to: TokenType }) => Promise<number>;

type BuyFromParlay = (data: { networkId: number, userAddress: Address, marketAddresses: Address[], positions: Field[], buyIn: number }) => Promise<void>;
type BuyFromParlayWithDifferentCollateralAndReferrer = (data: { networkId: number, userAddress: Address, marketAddresses: Address[], positions: Field[], tokenType: TokenType, buyIn: number }) => Promise<void>;
type BuyFromParlayWithEth = (data: { networkId: number, userAddress: Address, marketAddresses: Address[], positions: Field[], buyIn: number }) => Promise<void>;


export const isApproved: IsApproved = async ({ userAddress, buyIn, tokenType }) => {
  try {
    const allowance = await readContract({
      address: tokens[tokenType].address,
      abi: tokens[tokenType].abi,
      functionName: 'allowance',
      args: [userAddress, SPORTS_AMM_CONTRACT_ADDRESS]
    });

    return buyIn * (10 ** tokens.sUSD.decimals) <= Number(allowance);
  } catch (e) {
    console.log(e);
    return false;
  }
}

export const confirmApproved: ConfirmApproved = async (data) => {
  const approved = await isApproved(data);
  if (!approved) {
    const config = await prepareWriteContract({
      address: tokens[data.tokenType].address,
      abi: tokens[data.tokenType].abi,
      functionName: 'approve',
      args: [SPORTS_AMM_CONTRACT_ADDRESS, parseUnits(data.buyIn.toString(), 18)]
    });
    await writeContract(config);
  }
}

export const buyFromAMM: BuyFromAMM = async ({ networkId, userAddress, marketAddress, position, buyIn }) => {
  try {
    await confirmApproved({ userAddress, tokenType: 'sUSD', buyIn });

    const quote = await getSingleQuote(networkId, marketAddress, position, buyIn);
    const parsedPayout = ethers.parseEther(quote.payout.toString());
    const parsedActualBuyInCollateralAmount = ethers.parseEther(quote.actualBuyInCollateralAmount.toString());
    const parasedSlippage = ethers.parseEther(SLIPPAGE.toString());

    const buyConfig = await prepareWriteContract({
      address: SPORTS_AMM_CONTRACT_ADDRESS,
      abi: sportsAMMAbi,
      functionName: 'buyFromAMM',
      args: [marketAddress, position, parsedPayout, parsedActualBuyInCollateralAmount, parasedSlippage],
    });
    await writeContract(buyConfig);
  } catch (e) {
    console.log(e);
  }
}


export const etherTo: EtherTo = async ({ etherAmount, to }) => {
  const amount = await readContract({
    address: QUOTING_CONTRACT_ADDRESS,
    abi: quotingAbi,
    functionName: 'getMaximumReceived',
    args: [tokens[to].address, ethers.parseEther(etherAmount.toString())],
  });
  return Number(amount) / (10**18);
}

export const buyFromAMMWithETHAndReferrer: BuyFromAMMWithETHAndReferrer = async ({
  networkId, userAddress, marketAddress, position, buyIn
}) => {
  try {
    await confirmApproved({ userAddress, tokenType: 'ETH', buyIn });

    const usdAmount = await etherTo({etherAmount: buyIn, to: 'USDT'});
    console.log('usdt: ', usdAmount);

    const quote = await getSingleQuote(networkId, marketAddress, position, usdAmount);
    const parsedPayout = ethers.parseEther(quote.payout.toString());
    const parsedActualBuyInCollateralAmount = ethers.parseEther(quote.actualBuyInCollateralAmount.toString());
    const parasedSlippage = ethers.parseEther(SLIPPAGE.toString());

    const buyConfig = await prepareWriteContract({
      address: SPORTS_AMM_CONTRACT_ADDRESS,
      abi: sportsAMMAbi,
      functionName: 'buyFromAMMWithDifferentCollateral',
      args: [marketAddress, position, parsedPayout, parsedActualBuyInCollateralAmount, parasedSlippage, tokens.ETH.address],
    });
    await writeContract(buyConfig);
  } catch (e) {
    console.log(e);
  }
}

export const buyFromAMMWithCollateralAndReferrer: BuyFromAMMWithCollateralAndReferrer = async ({
  networkId, userAddress, marketAddress, position, tokenType, buyIn
}) => {
  try {
    await confirmApproved({ userAddress, tokenType, buyIn });
    const quote = await getSingleQuote(networkId, marketAddress, position, buyIn);
    const parsedPayout = ethers.parseEther(quote.payout.toString());
    const parsedActualBuyInCollateralAmount = ethers.parseEther(quote.actualBuyInCollateralAmount.toString());
    const parasedSlippage = ethers.parseEther(SLIPPAGE.toString());

    const buyConfig = await prepareWriteContract({
      address: SPORTS_AMM_CONTRACT_ADDRESS,
      abi: sportsAMMAbi,
      functionName: 'buyFromAMMWithDifferentCollateral',
      args: [marketAddress, position, parsedPayout, parsedActualBuyInCollateralAmount, parasedSlippage, tokens[tokenType].address],
    });
    await writeContract(buyConfig);
  } catch (e) {
    console.log(e);
  }
}

export const buyFromParlay: BuyFromParlay = async ({ networkId, userAddress, marketAddresses, positions, buyIn }) => {
  try {
    await confirmApproved({ userAddress, tokenType: 'sUSD', buyIn });

    const quote = await getParlayQuote(networkId, marketAddresses, positions, buyIn);
    const parsedPayout = ethers.parseEther(quote.payout.toString());
    const parsedActualBuyInCollateralAmount = ethers.parseEther(quote.actualBuyInCollateralAmount.toString());
    const parasedSlippage = ethers.parseEther(SLIPPAGE.toString());

    const buyConfig = await prepareWriteContract({
      address: PARLAY_AMM_CONTRACT_ADDRESS,
      abi: parlayAMMAbi,
      functionName: 'buyFromParlay',
      args: [marketAddresses, positions, parsedPayout, parsedActualBuyInCollateralAmount, parasedSlippage, '0x0000000000000000000000000000000000000000'],
    });
    await writeContract(buyConfig);
  } catch (e) {
    console.log(e);
  }
}

export const buyFromParlayWithDifferentCollateralAndReferrer: BuyFromParlayWithDifferentCollateralAndReferrer = async ({
  networkId, userAddress, marketAddresses, positions, tokenType, buyIn,
}) => {
  try {
    await confirmApproved({ userAddress, tokenType, buyIn });

    const quote = await getParlayQuote(networkId, marketAddresses, positions, buyIn);
    const parsedPayout = ethers.parseEther(quote.payout.toString());
    const parsedActualBuyInCollateralAmount = ethers.parseEther(quote.actualBuyInCollateralAmount.toString());
    const parasedSlippage = ethers.parseEther(SLIPPAGE.toString());

    const buyConfig = await prepareWriteContract({
      address: PARLAY_AMM_CONTRACT_ADDRESS,
      abi: parlayAMMAbi,
      functionName: 'buyFromParlayWithDifferentCollateralAndReferrer',
      args: [marketAddresses, positions, parsedPayout, parsedActualBuyInCollateralAmount, parasedSlippage, tokens[tokenType].address, '0x0000000000000000000000000000000000000000'],
    });
    await writeContract(buyConfig);
  } catch (e) {
    console.log(e);
  }
}

export const buyFromParlayWithEth: BuyFromParlayWithEth = async ({
  networkId, userAddress, marketAddresses, positions, buyIn,
}) => {

  console.log(marketAddresses);

  try {
    await confirmApproved({ userAddress, tokenType: 'ETH', buyIn });

    const usdAmount = await etherTo({etherAmount: buyIn, to: 'USDT'});
    console.log('usdt: ', usdAmount);

    const quote = await getParlayQuote(networkId, marketAddresses, positions, usdAmount);
    const parsedPayout = ethers.parseEther(quote.payout.toString());
    const parsedActualBuyInCollateralAmount = ethers.parseEther(quote.actualBuyInCollateralAmount.toString());
    const parasedSlippage = ethers.parseEther(SLIPPAGE.toString());

    const buyConfig = await prepareWriteContract({
      address: PARLAY_AMM_CONTRACT_ADDRESS,
      abi: parlayAMMAbi,
      functionName: 'buyFromParlayWithEth',
      args: [marketAddresses, positions, parsedPayout, parsedActualBuyInCollateralAmount, parasedSlippage, tokens.ETH.address, '0x0000000000000000000000000000000000000000'],
    });
    await writeContract(buyConfig);
  } catch (e) {
    console.log(e);
  }
}

export const claimSingle = async (marketAddress: Address) => {
  try {
    const config = await prepareWriteContract({
      address: marketAddress,
      abi: singleMarketAbi,
      functionName: 'exerciseOptions',
    });
    await writeContract(config);
  } catch (e) {
    console.log(e);
  }
}

export const claimParlay = async (marketAddress: Address) => {
  try {
    const config = await prepareWriteContract({
      address: PARLAY_AMM_CONTRACT_ADDRESS,
      abi: parlayAMMAbi,
      functionName: 'exerciseParlay',
      args: [marketAddress],
    });
    await writeContract(config);
  } catch (e) {
    console.log(e);
  }
}

