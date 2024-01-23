'use client'

import FilterBox from '@/@core/components/FilterBox/FilterBox';
import { FilterBoxItemProps } from '@/@core/components/FilterBox/FilterBoxItem';
import { FilterType, OddsType } from '@/@core/interfaces';
import { queryFrom } from '@/@core/utils/client';
import { useRouter, useSearchParams } from 'next/navigation';

const oddsList: FilterBoxItemProps<OddsType>[] = [
  { imageUrl: '/assets/images/american.jpg', title: 'American', value: 'american' },
  { imageUrl: '/assets/images/eu.png', title: 'Decimal', value: 'decimal' },
  { imageUrl: '/assets/images/normalized.jpg', title: 'Normalized', value: 'normalizedImplied' }
];

const filterList: FilterBoxItemProps<FilterType>[] = [
  { imageUrl: '/assets/images/calenda.jpg', title: 'All', value: 'all' },
  { imageUrl: '/assets/images/clock.png', title: 'Today', value: 'today' },
  { imageUrl: '/assets/images/hour.jpg', title: 'In 1h', value: 'in-1h' },
];

interface Props {
  odds: OddsType
  filter: FilterType
}

export default function FilterGroup({ odds, filter }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  
  const OddsChange = (type: OddsType) => {
    const {query} = queryFrom(params, {odds: type});
    router.push(`/scheduled/?${query}`);
  }

  const FilterChange = (type: FilterType) => {
    const {query} = queryFrom(params, {filter: type});
    router.push(`/scheduled/?${query}`);
  }

  return (
    <div className="filter-group">
      <FilterBox list={oddsList} value={odds} onChange={value => OddsChange(value)} />  
      <FilterBox list={filterList} value={filter} onChange={value => FilterChange(value)} />
    </div>
  )
}