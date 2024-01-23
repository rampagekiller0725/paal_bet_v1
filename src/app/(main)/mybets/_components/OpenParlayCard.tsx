import { OddsType, Position } from '@/@core/interfaces';
import { useSearchParams } from 'next/navigation';
import ClaimButton from './ClosedSingleCard/ClaimButton';

export default function OpenParlayCard(position: Position) {
  const params = useSearchParams();
  const oddsType: OddsType = params.get('odds') as OddsType ?? 'american';

  return (
    <div className="open-parlay-card">
      <div className="date-box">
        <div className="left-box">
          <span className="date">{'Parlay Bet'}</span>
          <span className="result">{position.status}</span>
        </div>
        {position.status === 'WON' && <ClaimButton />}
      </div>

      <div className="bet-box">
        {position.positions.map((pos, index) => {
          const { market } = pos;
          const { homeOdds, drawOdds, awayOdds } = market.odds;

          return (
            <div key={index} className="bet-box-item">
              <div className="bet-team">
                {`${market.homeTeam} (vs) ${market.awayTeam}`}
              </div>
              <div className="info-box-left">
                <span>{market.type}</span>
                <span>/</span>
                <span>{pos.position}</span>
              </div>
              <div className="odds">
                {pos.position === 0 ? homeOdds[oddsType].toFixed(2)
                  : pos.position === 1 ? awayOdds[oddsType].toFixed(2)
                    : pos.position === 2 ? drawOdds[oddsType].toFixed(2)
                      : -1
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}