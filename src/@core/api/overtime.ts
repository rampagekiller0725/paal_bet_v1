import axios from "axios"
import { League, Market, Position, PositionStatus, PositionType, Quote } from "../interfaces"
import { Field, Network } from "../enums";

const baseUrl = 'https://api.thalesmarket.io/overtime/networks';

const check = (data: any) => {
  if (typeof data !== 'object') {
    throw new Error('Wrong result');
  }
}

export const getLeagues = async (networkId: Network) => {
  const {data: leagues} = await axios.get<League[]>(`${baseUrl}/${networkId}/sports`);
  check(leagues);

  const sports: string[] = [];
  for (const league of leagues) {
    if (!sports.includes(league.sport)) {
      sports.push(league.sport);
    }
  }
  return {
    sports,
    leagues,
  }
}

export const getMarkets = async (networkId: Network, option: Partial<{sport: string, leagueId: number, ungroup: boolean}>) => {
  const {data} = await axios.get<Market[]>(`${baseUrl}/${networkId}/markets`, {
    params: {
      sport: option.sport,
      leagueId: option.leagueId,
      ungroup: option.ungroup,
    }
  });
  check(data);
  return data;
}

export const getMarket = async (networkId: number, marketAddress: string) => {
  const {data} = await axios.get<Market>(`${baseUrl}/${networkId}/markets/${marketAddress}`);
  check(data);
  return data;
}

export const getPositions = async (networkId: number, userAddress: string, option: {type?: PositionType, status?: PositionStatus}) => {
  const {data} = await axios.get<{[key in PositionType]: {[key in PositionStatus]: Position[]}}>(`${baseUrl}/${networkId}/users/${userAddress}/positions/?type=${option.type??''}&status=${option.status??''}`);
  check(data);

  return {
    singles: data.singles[option.status ?? 'open'],
    parlays: data.parlays[option.status ?? 'open'],
  }
}

export const getCollaterals = async (networkId: number) => {
  const {data} = await axios.get(`${baseUrl}/${networkId}/collaterals`);
  return data;
}

export const getSingleQuote = async (networkId: number, marketAddress: string, position: Field, buyIn: number) => {
  const {data} = await axios.get<Quote>(`${baseUrl}/${networkId}/markets/${marketAddress}/quote?position=${position}&buyIn=${buyIn}`);
  return data;
}

export const getParlayQuote = async (networkId: number, marketAddresses: string[], positions: Field[], buyIn: number) => {
  const {data} = await axios.get<Quote>(`${baseUrl}/${networkId}/parlay/quote?markets=${marketAddresses.join(',')}&positions=${positions.join(',')}&buyIn=${buyIn}`);
  return data;
}

