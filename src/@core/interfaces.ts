import { Field } from "./enums";

export type SupportedType = (
  'moneyline' | 'spread' | 'total' | 'doubleChance'
  | 'passingYards' | 'rushingYards' | 'passingTouchdonws'
  | 'receivingYards' | 'scoringTouchdowns' | 'fieldGoalsMade'
  | 'points' | 'shots' | 'goals'
  | 'homeruns' | 'strikeouts' | 'pitcherHitsAllowed' | 'hitsRecorded'
  | 'points' | 'rebounds' | 'assists' | 'doubleDouble' | 'tripleDouble'
);

export type DoubleChanceType = (
  'HomeTeamNotToLose'
  | 'AwayTeamNotToLose'
  | 'NoDraw'
);

export type BetType = 'single' | 'parlay';
export type BetStatus = 'WON' | 'LOSS';

export type PositionType = 'singles' | 'parlays';
export type PositionStatus = 'open' | 'claimable' | 'closed';

export type OddsType = (
  'american' | 'decimal' | 'normalizedImplied'
);

export type Odds = {
  [odd in OddsType]: number;
};

export interface League {
  id: number
  name: string
  sport: string
  supportedTypes: SupportedType[]
}

export interface PlayerProps {
  line: number
  outcome: number | null
  playerId: number
  playerName: number
  score: number
  type: SupportedType
}

export interface Market {
  address: `0x${string}`
  gameId: string
  sport: string
  type: SupportedType
  leagueId: number
  leagueName: string
  homeTeam: string
  awayTeam: string
  maturityDate: string
  spread: number
  total: number
  doubleChanceMarketType: DoubleChanceType
  playerProps: PlayerProps
  odds: {
    homeOdds: Odds
    awayOdds: Odds
    drawOdds: Odds
  }
  priceImpact: {
    homePriceImpact: number
    awayPriceImpact: number
    drawPriceImpact: number
  }
  bonus: {
    homeBonus: number
    awayBonus: number
    drawBonus: number
  }
  childMarkets: Market[]
}

export interface Position {
  account: string
  position: Field
  positions: Position[]
  payout: number
  paid: number
  status: BetStatus
  market: Market
  isClaimable: boolean
}

export interface PositionDto {
  market: Market
  position: Field
  paid: number
}

export type FilterType = 'all' | 'today' | 'in-1h';

export type WalletType = 'metamask' | 'trustwallet' | 'coinbase' | 'rainbow';

export interface Wallet {
  name: string
  type: WalletType
  imageUrl: string
}

export interface PageInfo {
  title: string
  path: string
}

// export type TokenType = 'sUSD' | 'USDT' | 'ETH' | 'WETH' | 'DAI' | 'USDC' | 'OP';
export type TokenType = 'sUSD' | 'USDT' | 'ETH' | 'DAI' | 'USDC';

export interface Token {
  type: TokenType // also name
}

export type NetworkType = 'optimism';

export interface Quote {
  quote: {[key in OddsType]: number}
  payout: number
  potenitialProfit: {
    usd: number
    percentage: number
  }
  actualBuyInCollateralAmount: number
  actualBuyInUsdAmount: number
  skew: number
}
