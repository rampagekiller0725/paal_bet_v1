import { ReactNode, Suspense } from "react";
import Header from "./_components/Header/Header";
import Footer from "./_components/Footer/Footer";

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="main-layout">
      <Suspense>
        <Header />
      </Suspense>
      <div className="footer-content">
        {children}
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </div>
  )
}