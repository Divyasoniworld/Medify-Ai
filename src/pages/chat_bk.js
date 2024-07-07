"use client";
import { useEffect, useState } from "react";
import {
  Bird,
  Book,
  Bot,
  Code2,
  CornerDownLeft,
  LifeBuoy,
  Mic,
  Paperclip,
  Pill,
  Menu,
  Image,
  Camera,
  SendHorizontal,
  Plus,
  History,
  CircleStop,
  Settings,
  SquareUser,
  AlertCircle,
  MicOff,
  Trash2,
  CircleX,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import MainNav from "@/components/MainNav";
import Cards from "@/components/Cards";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/context/ToastProvider"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import ChatScreen from "@/components/ChatScreen";

function Chat() {

  const chatData = [
    {
      "role": "user",
      "content": "What is the dosage for ibuprofen?"
    },
    {
      "role": "ai",
      "content": "The typical dosage for adults is 200-400 mg every 4-6 hours as needed. Do not exceed 1200 mg in a 24-hour period without consulting a doctor."
    },
    {
      "role": "user",
      "content": "What are the common side effects of ibuprofen?"
    },
    {
      "role": "ai",
      "content": "Common side effects of ibuprofen include stomach pain, heartburn, nausea, vomiting, gas, constipation, diarrhea, and dizziness."
    },
    {
      "role": "user",
      "content": "Can I take ibuprofen if I'm pregnant?"
    },
    {
      "role": "ai",
      "content": "It is generally recommended to avoid ibuprofen during pregnancy, especially in the third trimester, unless specifically advised by a healthcare provider."
    }
  ]

  const showToast = useToast()

  const { theme, setTheme } = useTheme();
  // const { toast } = useToast();

  const handleThemeChange = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [permission, setPermission] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [chatMessages, setChatMessages] = useState(chatData);
  const [showCards, setShowCards] = useState(true);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("SpeechRecognition API is not supported in this browser.");
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = "en-USA";

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
    };

    recognitionInstance.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    navigator.permissions.query({ name: "microphone" }).then((permissionStatus) => {
      setPermission(permissionStatus.state);
      permissionStatus.onchange = () => {
        setPermission(permissionStatus.state);
      };
    });
  }, []);

  const startRecognition = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopRecognition = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

    const handleSubmit = (e) => {
    e.preventDefault();
    if (transcript.trim()) {
      setChatMessages([...chatMessages, { role: "user", content: transcript }]);
      setTranscript("");
      setShowCards(false);
      // Here you would make the API call to get the AI response and add it to chatMessages
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImagePreviews = files.map((file) => {
      return URL.createObjectURL(file);
    });
    setImagePreviews([...imagePreviews, ...newImagePreviews]);
  };

  const handleImageDelete = (index) => {
    const updatedImagePreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedImagePreviews);
  };

  const handleMicPermition = () => {
    console.log('permission == "denied"', permission == "denied")
    if (permission == "denied") {
      // toast({
      //   description:
      //     "Microphone permission denied. Please enable it in your browser settings.",

      // });
      showToast("Microphone permission denied. Please enable it in your browser settings.")
    }
  }

  return (
    <div className="grid h-screen w-full md:pl-[56px]">
      <title>chat.medify</title>
      <aside className="inset-y fixed hidden md:flex lg:flex left-0 z-20 flex h-full border-r">
        <div className="border-b p-2">
          <Sheet className="">
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <Link
              href=""
              className="text-foreground text-2xl font-bold transition-colors md:hidden hover:text-foreground"
            >
              Medify <span className='text-[#595bcc]'>AI</span>
            </Link>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                  <Pill className="h-6 w-6" />
                  <Link
                    href=""
                    className="text-foreground text-2xl font-bold transition-colors hover:text-foreground"
                  >
                    Medify
                  </Link>
                </Link>
                <Link href="" className="text-muted-foreground hover:text-foreground mt-3">
                  <Button variant="secondary" onClick={() => { alert("hello"); }}>
                    <Plus className="mr-2 size-4 " />
                    New Chat
                  </Button>
                </Link>
                {/* <div className="flex items-center space-x-2">
                  <Switch
                    id="airplane-mode"
                    checked={theme === "dark"}
                    onCheckedChange={handleThemeChange}
                  />
                  <Label htmlFor="airplane-mode">Dark Mode</Label>
                </div> */}
                <Link href="" className="text-foreground hover:text-foreground ml-2">
                  <div className="flex items-center text-base">
                    <History className="size-4 mr-2" />
                    History
                  </div>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </aside>
      <div className="flex flex-col">
        <MainNav />
        <main className="grid chat-screen flex-1 gap-4 overflow-auto p-4 md:grid-cols lg:grid-cols">
          <div className="relative chat-div flex h-full flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
          {showCards ? <Cards /> : (
            <ChatScreen/>
            )}
            <div className="flex-1 space-div" />
            <form
              onSubmit={handleSubmit}
              className="relative chat-box md:mt-4 overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
              x-chunk="dashboard-03-chunk-1"
            >
              <Label htmlFor="message" className="sr-only">
                Message
              </Label>
              <Textarea
                id="message"
                value={transcript}
                onChange={(e) => {
                  setTranscript(e.target.value);
                }}
                placeholder={isListening ? "Listening..." : "Type your message here..."}
                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-3"
              />
              <div className="flex items-center p-3 pt-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label>
                        <Button variant="ghost" size="icon" asChild>
                          <div>
                            <Image className="size-5" />
                            <span className="sr-only">Attach file</span>
                          </div>
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </TooltipTrigger>
                    <TooltipContent side="top">Attach File</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label className="flex items-center">
                        <Button variant="ghost" size="icon" asChild>
                          <div>
                            <Camera className="size-5" />
                            <span className="sr-only">Upload image</span>
                          </div>
                        </Button>
                        <input
                          type="file"
                          capture="environment"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </TooltipTrigger>
                    <TooltipContent side="top">Upload image</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <label className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={isListening ? stopRecognition : startRecognition}
                          className={isListening ? "bg-red-500 hover:bg-red-500" : ""}
                        >
                          {permission == 'denied' ? <MicOff className="size-5" onClick={handleMicPermition} /> : (isListening) ? <CircleStop className="size-5" /> : <Mic className="size-5" />}
                        </Button>
                      </label>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {isListening ? "Stop Listening" : "Start Listening"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="ml-auto flex items-center space-x-2">
                  <Button type="submit" size="icon">
                    <SendHorizontal className="size-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap items-center p-3 pt-0">
                {imagePreviews.map((image, index) => (
                  <div key={index} className="relative mr-2 mb-2">
                    <img src={image} alt={`Preview ${index}`} className="h-16 w-16 rounded-md" />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleImageDelete(index)}
                      className="cancel_preview absolute top-0 right-7 m-1"
                    >
                      <CircleX className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Chat;
