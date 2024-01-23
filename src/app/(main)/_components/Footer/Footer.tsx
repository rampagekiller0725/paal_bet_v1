'use client'

import EventNoteIcon from '@mui/icons-material/EventNote';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import FooterButton from './FooterButton';
import BetslipButton from './BetslipButton';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { pages } from '@/@core/constants';


export default function Footer() {
  const path = usePathname();
  const params = useSearchParams();
  const query = params.toString();

  const router = useRouter();

  return (
    <footer className="footer">
      <FooterButton onClick={() => router.push(`${pages.scheduled.path}/?${query}`, {scroll: false})} title='Scheduled' icon={<EventNoteIcon />} selected={path === pages.scheduled.path} />
      <FooterButton onClick={() => router.push(`${pages.mybets.path}/?${query}`, {scroll: false})}  title='My Bets' icon={<WorkOutlineIcon />} selected={path === pages.mybets.path} />
      <BetslipButton onClick={() => router.push(`${pages.betslip.path}/?${query}`, {scroll: false})} selected={path === pages.betslip.path} />
    </footer>
  )
}