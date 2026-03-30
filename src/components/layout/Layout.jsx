import { Outlet } from "react-router-dom";
import { TopPromoBar } from "@/components/layout/TopPromoBar";
import { Header } from "@/components/layout/Header";
import { SecondaryNav } from "@/components/layout/SecondaryNav";
import { Footer } from "@/components/layout/Footer";

export function Layout() {
  return (
    <div className="app-shell">
      <TopPromoBar />
      <Header />
      <SecondaryNav />
      <main className="container page-wrap">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
