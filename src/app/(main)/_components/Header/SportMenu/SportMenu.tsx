'use client'

import BackButton from '@/@core/components/BackButton';
import { League, Market } from '@/@core/interfaces';
import { TreeView } from '@mui/x-tree-view';
import { useRouter, useSearchParams } from 'next/navigation';
import { StyledTreeItem } from './StyledItem';
import { Group, Sports } from '@mui/icons-material';
import { queryFrom } from '@/@core/utils/client';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { getLeagues, getMarkets } from '@/@core/api/overtime';
import { Select, SelectItem, Spinner } from '@nextui-org/react';
import { Network } from '@/@core/enums';


interface Props {
  visible: boolean
  onClose: VoidFunction
}

const networks = [
  { id: Network.Optimism, title: 'Optimism' },
  { id: Network.Arbitrum, title: 'Arbitrum' },
  { id: Network.Base, title: 'Base' },
  { id: Network.OptimismGoerli, title: 'Optimism Goerli' },
]

export default forwardRef<any, Props>(function SportMenu({ visible, onClose }: Props, ref) {
  const [loading, setLoading] = useState(true);
  const [sports, setSports] = useState<string[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  
  const router = useRouter();
  const params = useSearchParams();

  const network = params.get('network')??10;

  const SportChange = (sport: string) => {
    const { query } = queryFrom(params, {sport, leagueId: ''});
    onClose();
    router.push(`/scheduled/?${query}`);
  }
  
  const LeagueChange = (sport: string, leagueId: number) => {
    const {query} = queryFrom(params, {sport, leagueId});
    onClose();
    router.push(`/scheduled/?${query}`);
  }

  const NetworkChange = (net: number) => {
    const {query} = queryFrom(params, {network: net});
    router.push(`/scheduled/?${query}`);
  }

  const init = useCallback(async () => {
    setLoading(true);

    const {sports, leagues} = await getLeagues(+network); 
    const markets = await getMarkets(+network, {ungroup: true});
    setSports(sports);
    setLeagues(leagues);
    setMarkets(markets);

    setLoading(false);
  }, [network]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="sport-menu" style={visible ? { left: 0 } : undefined} ref={ref}>
      <div className="sport-menu-top">
        <BackButton onClick={onClose} />
        <Select label='Network' labelPlacement='outside-left' className='network-select' color='primary' selectedKeys={[network]} value={+network} onChange={e => NetworkChange(+e.target.value)}>
          {networks.map(net => (
            <SelectItem key={net.id} value={net.id}>{net.title}</SelectItem>
          ))}
        </Select>
      </div>
      <div className="title">Sports</div>
      {loading && 
        <div className='loading-box'>
          <Spinner />
        </div>
        }
      {!loading &&
        <div className="content">
          <TreeView
            aria-label='sports'
            defaultExpanded={['1']}
            // defaultCollapseIcon={<ArrowDropDownIcon />}
            // defaultExpandIcon={<ArrowRightIcon />}
            defaultEndIcon={<div style={{ width: 24 }} />}
            sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
          >
            {sports.map((sport, index) => (
              <StyledTreeItem
                key={index}
                nodeId={`${index + 1}`}
                labelText={`${sport} (${markets.filter(m => m.sport === sport).length})`}
                labelIcon={Group}
                iconVisible
                onIconClick={() => SportChange(sport)}
              >
                {leagues.filter(league => league.sport === sport).map((lea, j) => (
                  <StyledTreeItem
                    key={lea.id}
                    nodeId={`${index + 1}-${j + 1}`}
                    labelText={`${lea.name} (${markets.filter(m => m.leagueId === lea.id).length})`}
                    labelIcon={Sports}
                    iconVisible={false}
                    onClick={() => LeagueChange(sport, lea.id)}
                  />
                ))}
              </StyledTreeItem>
            ))}
          </TreeView>
        </div>
      }
    </div>
  )
})