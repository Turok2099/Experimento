import "./globals.css";
import Footer from "@/components/home/footer/Footer";
import Navbar from "@/components/home/navbar/Navbar";
import Providers from "./providers";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="layout">
            <Navbar />
            <main className="main">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
