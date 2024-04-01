import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import StoreProvider from "../providers/StoreProvider";
import ThemeProvider from "../providers/ThemProvider";
import "@styles/global.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Buildbox - Web Challenge",
  description: "Desafio técnico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <StoreProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
