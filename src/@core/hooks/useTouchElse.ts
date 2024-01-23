'use client'

import { MutableRefObject, useCallback, useEffect } from "react";

export default function useTouchElse(
  buttonRef: MutableRefObject<HTMLElement | null>,
  contentRef: MutableRefObject<HTMLElement | null>,
  visible: boolean,
  onClose: VoidFunction,
) {
  const checkContentBoundingRect = useCallback(() => {
    const content = contentRef.current;
    if (content) {
      const bound = content.getBoundingClientRect();
      if (bound.bottom > window.innerHeight || bound.bottom > document.documentElement.clientHeight) {
        content.style.bottom = '0';
      }
      if (bound.right > window.innerWidth || bound.right >  document.documentElement.clientWidth) {
        content.style.right = '0';
      }
    }
  }, [contentRef]);

  useEffect(() => {
    const clickListener = (ev: MouseEvent) => {
      if (visible && (buttonRef?.current ? !buttonRef?.current?.contains(ev.target as any) : true) && !contentRef.current?.contains(ev.target as any)) {
        onClose();
      }
    }
    const keyListener = (ev: KeyboardEvent) => {
      if (visible && ev.key === 'Escape') {
        onClose();
      }
    }

    addEventListener('click', clickListener);
    addEventListener('keydown', keyListener);
    
    return () => {
      removeEventListener('click', clickListener);
      removeEventListener('keydown', keyListener);
    }
  }, [visible, buttonRef, contentRef, onClose]);

  useEffect(() => {
    if (visible) {
      checkContentBoundingRect();
    }
  }, [visible, checkContentBoundingRect]);
}