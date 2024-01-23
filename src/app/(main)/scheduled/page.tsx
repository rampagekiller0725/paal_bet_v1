'use client'

import { getMarkets } from "@/@core/api/overtime";
import { FilterType, Market, OddsType } from "@/@core/interfaces";
import { marketFilter } from '@/@core/utils/both';
import MarketCard from './_components/MarketCard';
import NoBets from '@/@core/components/NoBets';
import FilterGroup from './_components/FilterGroup';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Spinner } from "@nextui-org/react";


export default function Page() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  const params = useSearchParams();
  const sport = params.get('sport') ?? '';
  const network = params.get('network') ?? 10;
  const leagueId = params.get('leagueId');
  const filter = params.get('filter') as FilterType ?? 'all';
  const odds = params.get('odds') as OddsType ?? 'decimal';

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const marketsData = await getMarkets(+network, {
        sport,
        leagueId: leagueId ? (+leagueId) : undefined,
        ungroup: true,
      });
      const markets = marketFilter(filter, marketsData);
      setMarkets(markets);
      setLoading(false);
    }

    init();
  }, [network, sport, leagueId, filter]);

  return (
    <div className="scheduled-page">
      <div className="top-part">
        <div className="sports-title">{sport}</div>
        <FilterGroup odds={odds} filter={filter} />
      </div>
      {loading && (
        <div className="scheduled-loading-page">
          <Spinner />
        </div>
      )}
      {!loading && (
        <>
          {markets.length === 0 && <NoBets />}
          {markets.length > 0 && (
            <div className="content">
              {markets.map(market => <MarketCard key={market.address} {...market} />)}
            </div>
          )}
        </>
      )}
    </div>
  )
}