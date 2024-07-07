import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/context/ToastProvider";
import "@/styles/globals.css";
import Head  from "next/document";

// import { Toaster } from "@/components/ui/toaster"


export default function App({ Component, pageProps }) {
  return (
    <>
      <title>Medify AI</title>
      <ThemeProvider>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </ThemeProvider>
    </>
  )
}
