import { OddsType, Position } from '@/@core/interfaces';
import { dateStr } from '@/@core/utils/both';
import { useSearchParams } from 'next/navigation';

export default function OpenSingleCard(position: Position) {
  const params = useSearchParams();
  const oddsType: OddsType = params.get('odds') as OddsType ?? 'american';
  
  const { homeOdds, drawOdds, awayOdds } = position.market.odds;

  return (
    <div className="open-single-card">
      <div className="date-box">
        <span className="date">{dateStr(position.market.maturityDate)}</span>
      </div>
      <div className="bet-team">
        {`${position.market.homeTeam} (vs) ${position.market.awayTeam}`}
      </div>
      <div className="bet-info">
        <div className="info-box-left">
          <span>{position.market.type}</span>
          <span>/</span>
          <span>{position.position}</span>
        </div>
        <div className="odds">
          {position.position === 0 ? homeOdds[oddsType].toFixed(2)
            : position.position === 1 ? awayOdds[oddsType].toFixed(2)
            : position.position === 2 ? drawOdds[oddsType].toFixed(2)
            : -1
          }
        </div>
      </div>
    </div>
  )
}