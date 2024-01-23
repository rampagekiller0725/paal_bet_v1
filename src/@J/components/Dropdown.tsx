'use client'

import { HTMLAttributes, ReactNode, useEffect, useRef, useState, cloneElement } from "react"
import './Dropdown.scss';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  header: ReactNode
  children: (props: {setVisible: (v: boolean) => void}) => ReactNode
}

export default function Dropdown({ header, ...props }: Props) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const ref = useRef<any>();
  const body = useRef<any>();

  useEffect(() => {
    const clickListener = (ev: MouseEvent) => {
      if (dropdownVisible && ref.current && !ref.current.contains(ev.target as any)) {
        setDropdownVisible(false);
      }
    }
    const keyListener = (ev: KeyboardEvent) => {
      if (dropdownVisible && ev.key === 'Escape') {
        setDropdownVisible(false);
      }
    }
    addEventListener('click', clickListener);
    addEventListener('keydown', keyListener);

    return () => {
      removeEventListener('click', clickListener);
      removeEventListener('keydown', keyListener);
    }
  }, [dropdownVisible, ref.current]);

    useEffect(() => {
    const checkContentBoundingRect = () => {
      const content = body.current;
      if (content) {
        const bound = content.getBoundingClientRect();
        if (bound.bottom > (window.innerHeight || document.documentElement.clientHeight)) {
          content.style.bottom = `calc(${bound.bottom - window.innerHeight + 5}px)`;
        }
        if (bound.right > (window.innerWidth || document.documentElement.clientWidth)) {
          content.style.right = `calc(${bound.right - window.innerWidth + 5}px)`;
        }
        if (bound.top < 0) {
          content.style.top = `calc(${-bound.top + 5}px)`;
        }
        if (bound.left < 0) {
          content.style.left = `calc(50% + ${-bound.left + 5}px)`;
        }
      }
    }

    if (dropdownVisible) {
      checkContentBoundingRect();
    }
  }, [dropdownVisible, body.current]);

  const toggleVisible = () => {
    setDropdownVisible(v => !v);
  }

  return (
    <div ref={ref} {...props} className={`j-dropdown ${props.className??''}`} onClick={e => setDropdownVisible(true)}>
      <div className="j-dropdown-header" onClick={e => {
        toggleVisible();
        e.stopPropagation();
      }}>
        {header}
      </div>
      {dropdownVisible && (
        <div className="j-dropdown-body" ref={body}>
          {(() => props.children({setVisible: setDropdownVisible})) ()}
        </div>
      )}
    </div>
  )
}
