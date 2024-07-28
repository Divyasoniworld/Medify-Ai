import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/context/ToastProvider";
import ContextProvider from '@/context/ContextProvider'
import { AuthProvider } from '@/context/AuthContext';
import { DialogProvider } from '@/context/DialogContext';
import "@/styles/globals.css";
export default function App({ Component, pageProps }) {

  return (
    <>
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
