'use client'

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { pages } from '@/@core/constants';
import { Network } from '@/@core/enums';
import { FilterType, OddsType } from '@/@core/interfaces';
import { getLeagues } from '@/@core/api/overtime';

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === pages.loading.path) {
      const redirect = async () => {
        const network = Network.Optimism;
        const odds: OddsType = 'decimal';
        const filter: FilterType = 'all';

        const { sports } = await getLeagues(network);
        const sport = sports[0] ?? '';
        router.replace(`${pages.scheduled.path}/?network=${network}&sport=${sport}&odds=${odds}&filter=${filter}`);
      }
  
      const timerId = setTimeout(redirect, 200);
      () => clearTimeout(timerId);
    }
  }, [router, pathname]);
  
  return (
    <div className="main-page">
      <div className="loading-text">
        Loading ...
      </div>
    </div>
  )
}
