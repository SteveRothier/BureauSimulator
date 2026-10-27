
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bureau Simulator — Le travail ne finit jamais",
  description:
    "Un jeu incrémental de gestion d'entreprise où le travail ne finit jamais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
