import { pages } from "@/@core/constants";
import { Metadata } from "next";
import { ReactNode, Suspense } from "react"


export const metadata: Metadata = {
  title: pages.mybets.title
};


interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <Suspense>
      {children}
    </Suspense>
  )
}