import React, { useContext, useState } from 'react'
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
import { Context } from "@/context/ContextProvider";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const MainNav = () => {
    const { theme, setTheme } = useTheme();
    const { user } = useAuth();
    const { setInput, setResultData, setShowResult } = useContext(Context)

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const router = useRouter()

    const handleThemeChange = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const handleLogout = async () => {
        try {
            const auth = getAuth(app)
            await signOut(auth)
            sessionStorage.removeItem("chatHistory");
            sessionStorage.removeItem("chatList");
            sessionStorage.removeItem("medifyUser");
            router.push("/")
        } catch (error) {
            console.log("signout error", error)
        }
    }

    const handleNewChat = () => {
        setShowResult(false)
        setResultData([])
        sessionStorage.removeItem("chatHistory");
        sessionStorage.removeItem("chatList");
        setInput(""); // Clear the chat input
        setIsSidebarOpen(false); // Close the sidebar
    };

    const openAlertDialog = () => {
        setIsAlertDialogOpen(true);
        setIsDropdownOpen(false); // Close the dropdown menu
    }

    return (
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link href="" className="text-foreground text-2xl font-bold transition-colors hover:text-foreground">
                    Medify<span className='text-[#595bcc]'>AI</span>
                </Link>
            </nav>
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
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
                            <Button variant="secondary" onClick={handleNewChat}><Plus className='mr-2 size-4 ' />New Chat</Button>
                        </Link>
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
                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                            <CircleUser className="h-5 w-5" />
                            <Avatar>
                                <AvatarImage src={user?.photoURL} alt="profile" />
                                <AvatarFallback>{ }</AvatarFallback>
                            </Avatar>
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={openAlertDialog}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setIsAlertDialogOpen(false)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => {
                                handleLogout();
                                setIsAlertDialogOpen(false); // Close the dialog after logout
                            }}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </header>
    )
}



export default MainNav