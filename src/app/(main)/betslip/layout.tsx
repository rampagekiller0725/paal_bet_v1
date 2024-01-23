import { pages } from "@/@core/constants";
import { Metadata } from "next";
import { ReactNode, Suspense } from "react";

export const metadata: Metadata = {
  title: pages.betslip.title,
}

export default function Layout({children}: {children: ReactNode}) {
  return (
    <Suspense>
      {children}
    </Suspense>
  );
}