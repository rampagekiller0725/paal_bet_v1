import { OddsType, Position } from '@/@core/interfaces';
import { useRouter, useSearchParams } from 'next/navigation';
import ClaimButton from './ClaimButton';
import { dateStr } from '@/@core/utils/both';
import { useState } from 'react';
import { claimSingle } from '@/@core/api/betting';
import { Spinner } from '@nextui-org/react';

export default function ClosedSingleCard(position: Position) {
  const params = useSearchParams();
  const oddsType: OddsType = params.get('odds') as OddsType ?? 'american';
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const onClick = async () => {
    if (position.isClaimable) {
      setLoading(true);
      await claimSingle(position.market.address);
      setLoading(false);
      router.refresh();
    }
  }

  const { homeOdds, drawOdds, awayOdds } = position.market.odds;

  return (
    <div className="closed-single-card">
      <div className="date-box">
        <div className='left-box'>
          <span className="date">{dateStr(position.market.maturityDate)}</span>
          <span className="result">{position.status}</span>
        </div>
        {position.status === 'WON' && !loading && <ClaimButton onClick={onClick} />}
        {position.status === 'WON' && loading && (
          <div style={{display: 'flex', alignItems: 'center', gap: '.5rem'}}>
            claiming ... <Spinner size='sm' />
          </div>
        )}
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
          {position.position === 0 && homeOdds ? homeOdds[oddsType].toFixed(2)
            : position.position === 1 && awayOdds ? awayOdds[oddsType].toFixed(2)
            : position.position === 2 && drawOdds ? drawOdds[oddsType].toFixed(2)
            : -1
          }
        </div>
      </div>
    </div>
  )
}