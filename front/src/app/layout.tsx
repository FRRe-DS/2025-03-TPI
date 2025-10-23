import "./globals.css";

import { Poppins, Inter } from "next/font/google";
import Footer from "../components/footer";
import NavBar from "@/components/NavBar";
import { url } from "inspector";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata = {
  title: "Mi Proyecto Logística",
  description: "Frontend de logística con diseño bordó/cherry",
  icons: {
    icon: [
      {url: "/logo.ico"},
    ],
  },
};


export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="es" className={`${poppins.variable} ${inter.variable}`}>
       
      <body className="bg-gray-100 text-[var(--color-text-dark)]">
        <NavBar />
        <main className="pt-24">
          {children}
        </main>
         <Footer />
      </body>
    </html>
  );
}
