import "../styles/Home.module.css";
import AuthProvider from "@/providers/authProvider";
import NavBarComponent from "@/components/layouts/navbar";

import { Exo_2 } from "next/font/google";
import "@/styles/globals.css";

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: [
    "100", "200", "300", "400", "500",
    "600", "700", "800", "900"
  ],
  style: ["normal", "italic"],
  variable: "--font-exo2",
});

export const metadata = {
  title: "TaskX",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={exo2.variable}>
      <body>
        <AuthProvider>
          <NavBarComponent/>
          {children}</AuthProvider>
      </body>
    </html>
  );
}
