import { Html, Head, Main, NextScript } from "next/document";
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "next-themes";
// import { Toaster } from "@/components/ui/toaster"
import { Toaster } from "react-hot-toast";
export default function Document({ children }) {
 
  return (
    <Html lang="en" suppressHydrationWarning >
      <Head />
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
          {/* <Toaster /> */}
          {/* <Toaster
  position="top-center"
  reverseOrder={false}
/>
           */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
