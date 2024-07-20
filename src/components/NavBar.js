import React, { useEffect } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { CircleUser, Menu, MessageSquareText, Moon, Package2, Pi, Pill, Search, Sun } from 'lucide-react'
import { Button } from './ui/button'
import { useTheme } from 'next-themes'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FcGoogle } from "react-icons/fc";
import { useAuth } from '@/context/AuthContext';
import { getAuth } from "firebase/auth"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import app from '../../firebaseConfig.js'
import { useRouter } from 'next/router'

const NavBar = () => {

    const { theme, setTheme } = useTheme();
    const router = useRouter()

    const handleThemeChange = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const { user, setUser, login, logout } = useAuth();

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user)
            } else {
                setUser(null)
            }
        })

        return () => unsubscribe();
    }, [])

    const signInWithGoogle = async () => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        try {
            let { user } = await signInWithPopup(auth, provider);
            router.push(`/chat?auth=${user?.accessToken}`)
        } catch (error) {
            console.log("google sign in error", error)
        }
    }

    return (
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 ">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold md:text-base"
                >
                    <Pill className="h-6 w-6" />
                    <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                    href=""
                    className="text-foreground text-2xl font-bold transition-colors hover:text-foreground"
                >
                    Medify<span className='text-[#595bcc]'>AI</span>
                </Link>

            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <Link
                    href=""
                    className="text-foreground text-2xl font-bold transition-colors md:hidden hover:text-foreground"
                >
                    Medify<span className='text-[#595bcc]'>AI</span>
                </Link>
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
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <form className="ml-auto flex-1 sm:flex-initial">
                    <div className="relative">
                        {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              /> */}
                    </div>
                </form>
                <Button variant="outline" size="icon" onClick={handleThemeChange}>
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                <Dialog>
                    <DialogTrigger><Button className="rounded-3xl bg-[#595bcc] text-white hover:bg-[#565dcf] ">sign in</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Sign In with Google</DialogTitle>
                            <DialogDescription>
                                Or sign in with other methods (coming soon!)
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <Button className="gap-3" variant="outline" type="submit" onClick={signInWithGoogle}><FcGoogle size={20} /> Login with Google</Button>
                        </div>

                    </DialogContent>
                </Dialog>



                {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <CircleUser className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu> */}
            </div>
        </header>
    )
}

export default NavBar