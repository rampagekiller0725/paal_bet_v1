import RemoveButton from './RemoveButton';
import { OddsType, PositionDto } from '@/@core/interfaces';
import useAppContext from '@/@core/hooks/useAppContext';
import { useSearchParams } from 'next/navigation';
import { dateStr } from '@/@core/utils/both';


export default function BetCard(position: PositionDto) {
  const {setDataWith} = useAppContext();
  const params = useSearchParams();
  const oddsType: OddsType = params.get('odds') as OddsType ?? 'american';
  
  const removePosition = () => {
    setDataWith(d => {
      let { positions } = d;
      positions = positions.filter(p => p.market.address !== position.market.address);
      return { ...d, positions };
    });
  }

  const { homeOdds, drawOdds, awayOdds } = position.market.odds;

  return (
    <div className="bet-card">
      <div className="date-box">
        <span className="date">{dateStr(position.market.maturityDate)}</span>
        <RemoveButton onClick={removePosition} />
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