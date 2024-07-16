import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  MessageSquareMore,
  Package2,
  Pill,
  Plus,
  Search,
  Users,
  History,
  MessageSquareText
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Cards from "@/components/Cards"
import NavBar from "@/components/NavBar"
import Image from "next/image"
import { useRouter } from "next/router"
import { ScrollArea } from "@/components/ui/scroll-area"

function Home() {
  const router = useRouter()

  
  const handleChatModule = () => {
    router.push("/chat")
  }

  const historyItems = [
    "Please provide information about this pills",
    "Please provide information about this pills",
    "Please provide information about this pills",
    "Please provide information about this pills",
    "Please provide information about this pills",
    "Please provide information about this pills",
    "Please provide information about this pills",
    "Please provide information about this pills",
    "Please provide information about this pills",
    "Please provide information about this pills",
    "Chat 2",
    "Chat 3",
    "Chat 4",
    "Chat 5",
  ];

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
                  <Pill className="h-6 w-6" />
                  <Link href="" className="text-foreground text-2xl font-bold transition-colors hover:text-foreground">
                    Medify<span className='text-[#595bcc]'>AI</span>
                  </Link>
                </Link>

                <Link href="/faq" className="text-foreground hover:text-foreground ml-2">
                  <div className='flex items-center  text-base'>
                    <MessageSquareText className='size-4 mr-2' />
                    Faq's
                  </div>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </aside>
      <div className="flex-1">
        <NavBar />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-2">
            <Card className="xl:col-span-1" x-chunk="dashboard-01-chunk-4" >
              <CardHeader className="flex justify-center items-center">
                <div className="grid gap-2">
                  <Image className="image-animation" src="/assets/images/doctor.png" width={350} height={350} alt="doctor" />
                  <Image
                    className="pill-image mt-5"
                    src="/assets/images/pillhand.png"
                    width={300}
                    height={250}
                    alt="pills-left"
                  />

                  <Image
                    className="pills mt-5 transparent"
                    src="/assets/images/pill4.png"
                    width={300}
                    height={250}
                    alt="pills-right"
                  />

                  <Image
                    className="pills-top mt-5 transparent"
                    src="/assets/images/pill4.png"
                    width={300}
                    height={250}
                    alt="pills-top"
                  />

                </div>
              </CardHeader>
              <CardContent>
              </CardContent>
            </Card>

            <Card className="title-tagline" x-chunk="dashboard-01-chunk-5">
              <CardContent >
                <div className="flex justify-center items-center mt-3 md:mt-7">
                  <CardTitle className="text-5xl p-2 font-bold bg-gradient-to-r from-blue-700 via-blue to-slate-600 bg-clip-text text-transparent whitespace-nowrap">Medify</CardTitle>
                </div>
                <CardDescription className="text-lg md:text-3xl dark:text-white font-semibold text-slate-600 flex justify-center items-center mt-5">
                  Know your meds, simplify your health
                </CardDescription>
                <div className="flex justify-center mt-10 items-center">
                  <Button onClick={handleChatModule} className="rounded-3xl bg-[#595bcc] text-white hover:bg-[#565dcf]">Chat Now</Button>
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
