'use client'

import { NextUIProvider } from "@nextui-org/react";
import { ReactNode } from "react";

// const darkTheme = createTheme

export default function NextUiProvider(props: { children: ReactNode }) {
  return (
    <NextUIProvider>
      {props.children}
    </NextUIProvider>
  )
}