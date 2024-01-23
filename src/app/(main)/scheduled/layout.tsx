import { getMarkets } from "@/@core/api/overtime";
import { pages } from "@/@core/constants";
import { getNetwork } from "@/@core/utils/server";
import { Metadata } from "next";
import { ReactNode, Suspense } from "react";

export const metadata: Metadata = {
  title: pages.scheduled.title
}

interface Props {
  children: ReactNode
}

export default async function Layout({ children }: Props) {
  return (
    <Suspense>
      {children}
    </Suspense>
  )
}