import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/context/ToastProvider";
import "@/styles/globals.css";
import Head from "next/document";
import ContextProvider from '@/context/ContextProvider'
// import { Toaster } from "@/components/ui/toaster"
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AuthProvider } from '@/context/AuthContext';
import { DialogProvider } from '@/context/DialogContext';

export default function App({ Component, pageProps }) {

  return (
    <>
      <title>Medify AI</title>
      <AuthProvider>
        <ContextProvider>
          <DialogProvider>
            <ThemeProvider>
              <ToastProvider>
                <Component {...pageProps} />
              </ToastProvider>
            </ThemeProvider>
          </DialogProvider>
        </ContextProvider>
      </AuthProvider>
    </>
  )
}
