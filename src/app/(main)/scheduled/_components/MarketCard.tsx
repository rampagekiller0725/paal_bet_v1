'use client'

import InfoBox from "@/@core/components/InfoBox";
import MoreButton from "@/@core/components/MoreButton";
import { Field } from "@/@core/enums";
import { Market, OddsType, SupportedType } from "@/@core/interfaces";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import InfoGroup from "./InfoGroup";
import useAppContext from '@/@core/hooks/useAppContext';
import { dateStr, teamLogoUrl } from "@/@core/utils/both";

export default function MarketCard(market: Market) {
  const params = useSearchParams();
  const oddsType: OddsType = params.get('odds') as OddsType ?? 'american';
  const {data, setDataWith} = useAppContext();

  const moreOpen = data.openDetailed.includes(market.address);

  const types: SupportedType[] = useMemo(() => {
    const list: SupportedType[] = [];
    for (const m of market.childMarkets) {
      if (!list.includes(m.type)) {
        list.push(m.type);
      }
    }
    return list;
  }, [market.childMarkets]);
  
  const togglePosition = (market: Market, position: Field) => {
    setDataWith(d => {
      let {positions} = d;
      if (positions.some(pos => pos.market.address === market.address && pos.position === position)) {
        positions = positions.filter(pos => !(pos.market.address === market.address && pos.position === position));
      } else {
        positions = positions.filter(pos => pos.market.gameId !== market.gameId);
        positions = [...positions, {
          market,
          position,
          paid: 0,
        }];
      }
      return {
        ...d,
        positions,
      }
    });
  }

  const openMore = () => {
    setDataWith(d => ({
      ...d,
      openDetailed: moreOpen ? d.openDetailed.filter(address => (address !== market.address)) : [...d.openDetailed, market.address],
    }));
  }

  const {homeOdds, drawOdds, awayOdds} = market.odds;

  return (
    <div className="market-card">
      <div className="top-box">
        <span className="date-box">{dateStr(market.maturityDate)}</span>
        <span className="league-name">{market.leagueName}</span>
      </div>
      <div className="team-info">
        {/* Home Team */}
        <div className="team-box">
          <Image src={teamLogoUrl(market.leagueName, market.homeTeam)} alt="Home" className="team-img" width={100} height={100} />
          <div className="team-name">{market.homeTeam}</div>
        </div>
        {/* vs image */}
        <Image src='/assets/images/vs.png' alt="vs" className="vs-img" width={100} height={100} />
        {/* Away Team */}
        <div className="team-box">
          <Image src={teamLogoUrl(market.leagueName, market.awayTeam)} alt="Away" className="team-img" width={100} height={100} />
          <div className="team-name">{market.awayTeam}</div>
        </div>
      </div>
      {/* moneyLine */}
      <div className="odds-box">
        <InfoBox title="1" field={Field.Home} value={homeOdds[oddsType]?.toFixed(2)} market={market} onClick={() => togglePosition(market, Field.Home)} />
        {market.odds.drawOdds[oddsType] && <InfoBox title="X" field={Field.X} value={+drawOdds[oddsType].toFixed(2)} market={market} onClick={() => togglePosition(market, Field.X)} />}
        <InfoBox title="2" field={Field.Away} value={awayOdds[oddsType]?.toFixed(2)} market={market} onClick={() => togglePosition(market, Field.Away)} />
        <MoreButton open={moreOpen} onClick={openMore} />
      </div>
      {moreOpen && types.map((type, index) => <InfoGroup key={index} type={type} parentMarket={market} onPositionSelected={togglePosition} />)}
    </div>
  )
}