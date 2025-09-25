import "./globals.css";
import Footer from "@/components/home/footer/Footer";
import Navbar from "@/components/home/navbar/Navbar";
import Providers from "./providers";
import { MenuProvider } from "@/context/MenuContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body>
        <Providers>
          <MenuProvider>
            <div className="layout">
              <Navbar />
              <main className="main">{children}</main>
              <Footer />
            </div>
          </MenuProvider>
        </Providers>
      </body>
    </html>
  );
}
