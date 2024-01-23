'use client'

import TabBox from "./_components/TabBox/TabBox";
import { useEffect, useState } from "react";
import { getPositions } from "@/@core/api/overtime";
import { redirect, useSearchParams } from "next/navigation";
import { Position, PositionType } from "@/@core/interfaces";
import PositionBox from "./_components/PositionBox";
import OpenSingleCard from "./_components/OpenSingleCard";
import ClosedSingleCard from "./_components/ClosedSingleCard/ClosedSingleCard";
import OpenParlayCard from "./_components/OpenParlayCard";
import ClosedParlayCard from "./_components/ClosedSingleCard/ClosedParlayCard";
import { useAccount, useConnect, useWalletClient } from "wagmi";
import { queryFrom } from "@/@core/utils/client";

type Result = {[key in PositionType]: Position[]};
const initial: Result = {
  singles: [],
  parlays: [],
}

export default function Page() {
  const [loading, setLoading] = useState({open: true, closed: true, claimable: true});
  const [openPositions, setOpenPositions] = useState<Result>(initial);
  const [closedPositions, setClosedPositions] = useState<Result>(initial);
  const [claimablePositions, setClaimablePositions] = useState<Result>(initial);
 
  const params = useSearchParams();
  const account = useAccount();

  useEffect(() => {
    if (account.status !== 'reconnecting' && !account.isConnected) {
      const {query} = queryFrom(params, {});
      redirect(`/connect-wallet/?${query}`);
    }
  });

  const networkId = params.get('network')??10;
  const userAddress = account.address!;

  useEffect(() => {
    setLoading({open: true, closed: true, claimable: true});
    getPositions(+networkId, userAddress, {status: 'open'}).then(data => {
      setOpenPositions(data);
      setLoading(loading => ({...loading, open: false}));
    });
    getPositions(+networkId, userAddress, {status: 'closed'}).then(data => {
      setClosedPositions(data);
      setLoading(loading => ({...loading, closed: false}));
    });
    getPositions(+networkId, userAddress, {status: 'claimable'}).then(data => {
      setClaimablePositions(data);
      setLoading(loading => ({...loading, claimable: false}));
    });
  }, []);

  

  return (
    <div className="mybets-page">
      <TabBox tabs={[
        {
          title: 'Open',
          widget: <PositionBox positions={openPositions} loading={loading.open} SingleCard={OpenSingleCard} ParlayCard={OpenParlayCard} />,
        },
        {
          title: 'Closed',
          widget: <PositionBox positions={closedPositions} loading={loading.closed} SingleCard={ClosedSingleCard} ParlayCard={ClosedParlayCard} />,
        },
        {
          title: 'Claimable',
          badgeText: (claimablePositions.singles.length + claimablePositions.parlays.length) > 0 ? (claimablePositions.singles.length + claimablePositions.parlays.length).toString() : undefined,
          widget: <PositionBox positions={claimablePositions} loading={loading.claimable} SingleCard={ClosedSingleCard}  ParlayCard={ClosedParlayCard}  />,
        },
      ]} />
    </div>
  )
}