import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { CircleUser, History, Menu, Moon, Package2, Pi, Pill, Plus, Search, Settings, Sun } from 'lucide-react'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth"
import app from '../../firebaseConfig'
import { useAuth } from '@/context/AuthContext'

const MainNav = () => {

    const { theme, setTheme } = useTheme();
    const { user, setUser, login, logout } = useAuth();
    const router = useRouter()

    const handleThemeChange = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const handleLogout = async () => {
        try {
            const auth = getAuth(app)
            await signOut(auth)
            router.push("/")
        } catch (error) {
            console.log("signout error", error)
        }
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
        "Please provide information about this pills",
        "Chat 2",
        "Chat 3",
        "Chat 4",
        "Chat 5",
    ];
    return (
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link href="" className="text-foreground text-2xl font-bold transition-colors hover:text-foreground">
                    Medify<span className='text-[#595bcc]'>AI</span>
                </Link>
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <Link href="" className="text-foreground text-2xl font-bold transition-colors md:hidden hover:text-foreground">
                    Medify<span className='text-[#595bcc]'>AI</span>
                </Link>
                <SheetContent className="side-sheet" side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                            <Pill className="h-6 w-6" />
                            <Link href="" className="text-foreground text-2xl font-bold transition-colors hover:text-foreground">
                                Medify<span className='text-[#595bcc]'>AI</span>
                            </Link>
                        </Link>
                        <Link href="" className="text-muted-foreground hover:text-foreground mt-3">
                            <Button variant="secondary" onClick={() => { alert("hello") }}><Plus className='mr-2 size-4 ' />New Chat</Button>
                        </Link>

                        <Link href="" className="text-foreground hover:text-foreground ml-2">
                            <div className="flex items-center text-base">
                                <History className="size-4 mr-2" />
                                History
                            </div>
                        </Link>

                        <ScrollArea className="chat-history mt-2">
                            {historyItems.map((item, index) => (
                                <Link key={index} href="#" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted-background">
                                    {item}
                                </Link>
                            ))}
                        </ScrollArea>
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <form className="ml-auto flex-1 sm:flex-initial">
                    <div className="relative">
                    </div>
                </form>
                <Button variant="outline" size="icon" onClick={handleThemeChange}>
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <CircleUser className="h-5 w-5" />
                            <Avatar>
                                <AvatarImage src={user?.photoURL} alt="profile" />
                                <AvatarFallback>{}</AvatarFallback>
                            </Avatar>
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}

export default MainNav