import type { Metadata } from "next";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("site_title")
    .eq("id", 1)
    .maybeSingle();

  const title = (data as { site_title?: string } | null)?.site_title || "KYZOKIDD";

  return {
    title,
    description:
      "Official site of Kyzo Kidd — New Jersey artist, RNF (Real Never Fail). Turning pain into power.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("accent_hex")
    .eq("id", 1)
    .maybeSingle();

  const accent = (data as { accent_hex?: string } | null)?.accent_hex || "#b3241f";

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style>{`:root { --blood-bright: ${accent}; }`}</style>
      </head>
      <body className="min-h-full flex flex-col bg-bg text-bone">
        <div className="grain" />
        {children}
      </body>
    </html>
  );
}
