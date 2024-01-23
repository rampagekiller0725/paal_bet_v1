'use client'

import My from "@/@core/components/Button";
import MenuIcon from '@mui/icons-material/Menu';
import WalletBox from "./WalletBox";
import SportMenu from "./SportMenu/SportMenu";
import Image from "next/image";
import { useRef, useState } from "react";
import { usePathname } from 'next/navigation';
import useTouchElse from '@/@core/hooks/useTouchElse';
import J from "@/@J";



const titles: { [key: string]: string } = {
  '/scheduled': 'Scheduled',
  '/betslip': 'Betslip',
  '/mybets': 'My Bets',
  '/connect-wallet': 'Wallets'
};


export default function Header() {
  const [menuVisible, setMenuVisible] = useState(false);
  const path = usePathname();

  const buttonRef = useRef<any>();
  const contentRef = useRef<any>();
  useTouchElse(buttonRef, contentRef, menuVisible, () => setMenuVisible(false));

  return (
    <header className="header">
      <div className="menu-box">
        {path === '/scheduled' && (
          <My.Button onClick={() => setMenuVisible(true)} ref={buttonRef} >
            <MenuIcon />
          </My.Button>
        )}
        <div className="title">{titles[path]}</div>
      </div>
      <div className="right-part">
        <WalletBox />
        <Image src='/assets/images/logo.jpg' alt='logo' className='logo' width={100} height={100} />
      </div>
      <SportMenu visible={menuVisible} onClose={() => setMenuVisible(false)} ref={contentRef} />
    </header>
  )
}