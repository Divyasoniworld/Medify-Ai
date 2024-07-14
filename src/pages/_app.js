import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/context/ToastProvider";
import "@/styles/globals.css";
import Head from "next/document";
import ContextProvider from '@/context/ContextProvider'
// import { Toaster } from "@/components/ui/toaster"


export default function App({ Component, pageProps }) {
  return (
    <>
      <title>Medify AI</title>
          <ContextProvider>
      <ThemeProvider>
        <ToastProvider>
            <Component {...pageProps} />
        </ToastProvider>
      </ThemeProvider>
          </ContextProvider>
    </>
  )
}
