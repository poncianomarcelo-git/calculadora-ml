import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calculadora ML — Precificação Mercado Livre",
  description: "Calcule o preço ideal para seus produtos no Mercado Livre considerando comissões, impostos e lucro desejado.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full bg-ml-gray font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
