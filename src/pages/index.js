import Link from "next/link"
import {
  Menu,
  MessageSquareText,
  File
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import NavBar from "@/components/NavBar"
import Image from "next/image"
import { useRouter } from "next/router"
import { useDialog } from '@/context/DialogContext';
import { useAuth } from "@/context/AuthContext"
import { getAuth } from "firebase/auth"
import { useEffect } from "react"
import app from '../../firebaseConfig'
import NewFeatureText from "@/components/NewFeatureText"

function Home() {
  const router = useRouter()

  const { openDialog } = useDialog();

  const handleChatModule = () => {
    router.push("/chat")
  }

  const { setUser } = useAuth();



  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
        router.push("/chat")
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe();
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <aside className="hidden lg:flex w-14 flex-col border-r bg-background sticky top-0 h-screen">
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <Sheet>
            <SheetTrigger asChild>
              <button>
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent className="side-sheet" side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Link href="" className="text-foreground text-2xl font-bold transition-colors hover:text-foreground">
                    Medify<span className='text-[#595bcc]'>AI</span>
                  </Link>
                </Link>

                <Link href="/faq" className="text-foreground hover:text-foreground">
                  <div className='flex items-center  text-base'>
                    <MessageSquareText className='size-4 mr-2 mt-1' />
                    Faq's
                  </div>
                </Link>
                <Link href="/privacy" className="text-foreground hover:text-foreground">
                  <div className='flex items-center  text-base'>
                    <File className='size-4 mr-2 mt-1' />
                    Privacy policy
                  </div>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </aside>
      <div className="flex-1">
        <NavBar />
        <main className="main-chat-div flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-2 items-center min-h-[60vh]">
            <Card className="xl:col-span-1" x-chunk="dashboard-01-chunk-4">
              <CardHeader className="flex justify-center items-center">
                <div className="grid gap-2">
                  <Image
                    className="image-animation"
                    src="/assets/images/Doctor-pana.svg"
                    alt="doctor"
                    width={500}
                    height={500}
                  />
                </div>
              </CardHeader>
            </Card>
            <Card className="title-tagline" x-chunk="dashboard-01-chunk-5">
              <CardContent>
                <div className="flex justify-center items-center mt-6 md:mt-10">
                  <CardTitle className="text-5xl p-2 font-bold bg-gradient-to-r from-blue-700 via-blue to-slate-600 bg-clip-text text-transparent whitespace-nowrap">
                    Medify
                  </CardTitle>
                </div>
                <CardDescription className="text-lg md:text-3xl dark:text-white font-semibold text-slate-600 flex justify-center items-center mt-8 md:mt-12">
                  Know your meds, simplify your health
                </CardDescription>
                <div className="flex justify-center mt-12 md:mt-16 items-center">
                  <Button onClick={openDialog} className="rounded-3xl bg-[#595bcc] text-white hover:bg-[#565dcf]">
                    Connect with Medify
                  </Button>
                </div>
                <CardDescription className="hidden md:flex lg:flex text-lg md:text-xl dark:text-white font-semibold text-slate-600 mt-10 lg:mt-16 justify-center items-center">
                  <NewFeatureText text="New features coming soon. Stay tuned!" />
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="extra-card md:hidden lg:hidden mt-10" x-chunk="dashboard-01-chunk-6">
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <CardDescription className="text-lg md:text-3xl dark:text-white font-semibold text-slate-600 flex justify-center items-center mt-5">
                    <NewFeatureText text=" New features coming soon. Stay tuned!" />
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Home
