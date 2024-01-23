'use client'

import { useRef, useState } from "react"
import FilterBoxItem, { FilterBoxItemProps } from "./FilterBoxItem";
import useTouchElse from '@/@core/hooks/useTouchElse';

interface Props {
  list: (Omit<FilterBoxItemProps, 'onClick'>)[]
  value: any
  onChange: (value: any) => void
}

export default function FilterBox({ list, value, onChange }: Props) {
  const [contentVisible, setContentVisible] = useState(false);
  
  const titleRef = useRef<any>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleContentVisible = () => {
    setContentVisible(visible => !visible);
  }

  const onItemSelected = (value: any) => {
    onChange(value);
    setContentVisible(false);
  }

  useTouchElse(titleRef, contentRef, contentVisible, () => setContentVisible(false));

  return (
    <div className="filter-box">
      <div className="filter-box-title" ref={titleRef} onClick={toggleContentVisible}>
        {list.find(li => li.value === value)?.title ?? 'No item'}
      </div>
      <div className="filter-box-content" ref={contentRef} style={{display: contentVisible ? 'flex' : 'none'}}>
        {list.map((data, index) => <FilterBoxItem key={index} {...data} onClick={onItemSelected} />)}
      </div>
    </div>
  )
}