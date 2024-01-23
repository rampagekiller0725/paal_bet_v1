'use client'

import { ReactNode, useState } from 'react';
import TabButton from './TabButton';

interface Props {
  tabs: {
    title: string
    widget: ReactNode
    badgeText?: string
  }[]
}

export default function TabBox({ tabs }: Props) {
  const [currentTab, setCurrentTab] = useState(0);
  
  return (
    <div className="tab-box">
      <div className="top-part">
        {tabs.map((t, index) => <TabButton key={index} title={t.title} selected={currentTab === index} badgeText={t.badgeText} onClick={() => setCurrentTab(index)} />)}
      </div>
      {tabs[currentTab].widget}
    </div>
  )
}