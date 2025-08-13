import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Background from "../../../components/Background";
import NewMobileHeader from "@/components/NewMobileHeader";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      {/* <MobileHeader /> */}
      <Header />
      <NewMobileHeader />
      {children}
      <Footer />
      <Background />
    </div>
  );
}
