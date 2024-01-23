'use client'

import My from "@/@core/components/Button";
import { Badge } from "@mui/material";
import HikingIcon from '@mui/icons-material/Hiking';
import useAppContext from '@/@core/hooks/useAppContext';

export default function BetslipButton(props: My.ButtonProps) {
  const { data: {positions} } = useAppContext();
  return (
    <Badge color="secondary" badgeContent={positions.length > 0 ? positions.length : ''} invisible={positions.length === 0} sx={{'.MuiBadge-badge': {right: '16px', top: '12px'}}}>
      <My.Button className='betslip-button' {...props} style={props.selected ? { color: 'white' } : undefined}>
        <div className="icon">{<HikingIcon />}</div>
        <span className="title">{'Betslip'}</span>
      </My.Button>
    </Badge>
  )
}