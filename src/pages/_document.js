import { Html, Head, Main, NextScript } from "next/document";
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "next-themes";

export default function Document({ children }) {

  return (
    <Html lang="en" suppressHydrationWarning >
      <Head>
        <meta property="og:title" content="Medify AI" />
        <meta property="og:description" content="Know your meds, simplify your health" />
        <meta property="og:image" content="https://ik.imagekit.io/medifyai/appImages/appImage.png" />
        <link rel="icon" type="image/png" href="https://ik.imagekit.io/medifyai/appImages/favicon.png"></link>
        <title>Medify AI</title>
      </Head>
      <body
        className={cn(
          " bg-background font-sans antialiased",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme=""
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
