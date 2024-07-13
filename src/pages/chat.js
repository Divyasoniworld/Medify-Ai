import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MainNav from "@/components/MainNav";
import { Camera, Menu, Mic, Pill, Plus, SendHorizontal, Image, MicOff, CircleStop, CircleX, History } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import Cards from "@/components/Cards";

export default function chat() {

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
  // const [chatMessages, setChatMessages] = useState(chatData);
  const [showCards, setShowCards] = useState(true);

  const [chatHistory, setChatHistory] = useState([])

  console.log('chatHistory', chatHistory)
  console.log('imagePreviews', imagePreviews)

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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (transcript.trim()) {
  //     setChatMessages([...chatMessages, { role: "user", content: transcript }]);
  //     setTranscript("");
  //     setShowCards(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      // Create a new message object for the user's input
      const userMessage = { role: 'user', response: transcript };

      // Update chat history state to include the user's message
      setChatHistory(prev => [...prev, userMessage]);

      // Clear input field after updating state
      setTranscript('');
      setImagePreviews([]);

      const result = await axios.post('/api/medifyai', { transcript, imagePreviews });
      const aiResponse = { role: 'AI', response: result.data.response };

      // Update chat history state to include the AI's response
      setChatHistory(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error calling API:', error);
      // setResponse('An error occurred while fetching the data.');
    }
  };




  const [imageData, setImageData] = useState([])


  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Process each file to create an object with path and mimeType
    const newImagePreviews = files.map((file) => {
      const path = URL.createObjectURL(file); // Get path (URL) for preview
      const mimeType = file.type; // Get mimeType of the file

      // Return object with path and mimeType
      return {
        path,
        mimeType,
      };
    });

    // Assuming imagePreviews is your state array holding these objects
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

  // Function to render formatted text
  // const renderFormattedText = (text) => {
  //   // Replace \n with <br> for line breaks
  //   const parts = text.split('\n');

  //   return parts.map((part, index) => (
  //     <React.Fragment key={index}>
  //       {index > 0 && <br />} {/* Add <br> after each line except the first */}
  //       {part}
  //     </React.Fragment>
  //   ));
  // };.

  const formatText = (text) => {
    // Replace *bold* with <strong>bold</strong>
    text = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

    // Replace \n with <br> for line breaks
    text = text.replace(/\n/g, '<br>');

    // Replace - list item with <li>list item</li>
    text = text.replace(/^- (.*)/gm, '<li>$1</li>');

    // Wrap in <ul> if there are list items
    if (text.includes('<li>')) {
      text = `<ul>${text}</ul>`;
    }

    // Render as HTML
    return { __html: text };
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex">
        <aside className="w-14 flex-col border-r bg-background sticky hidden md:flex top-0 h-screen">
          <nav className="flex flex-col items-center gap-4 px-2 py-5">
            <Sheet>
              <SheetTrigger asChild>
                <button>
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent className="side-sheet" side="left">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                    <Pill className="h-6 w-6" />
                    <span className="text-foreground text-2xl font-bold transition-colors hover:text-foreground">
                      Medify<span className='text-[#595bcc]'>AI</span>
                    </span>
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground mt-3">
                    <Button variant="secondary" onClick={() => { alert("hello") }}>
                      <Plus className='mr-2 size-4 ' />New Chat
                    </Button>
                  </Link>
                  <Link href="#" className="text-foreground hover:text-foreground ml-2">
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
          </nav>
          {/* <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    prefetch={false}
                  >
                    <SettingsIcon className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav> */}
        </aside>
        <div className="flex-1 flex flex-col">
          <MainNav />
          <div className="flex-1 overflow-auto pt-16 p-4">
            <div className="grid gap-4">
              {
                chatHistory.length > 0 ?
                  (
                    chatHistory.map((chat, index) => {
                      return (

                        (chat.role) != "AI" ?
                          (
                            <div className='flex items-start gap-3 justify-end'>
                              <div className="bg-primary rounded-lg p-3 max-w-[80%] text-primary-foreground">
                                <p className="text-sm">
                                  {chat.response}
                                </p>
                              </div>
                              <Avatar className="w-8 h-8">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback>Me</AvatarFallback>
                              </Avatar>
                            </div>
                          ) : (
                            <div className="flex items-start gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback>AI</AvatarFallback>
                              </Avatar>
                              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                                {typeof chat.response === 'string' && (
                                  <div dangerouslySetInnerHTML={formatText(chat.response)} />
                                )}
                              </div>
                            </div>
                          )
                      )
                    })
                  ) : <Cards />

              }
            </div>
          </div>
          <div className="sticky bottom-0 bg-card p-4">
            <div className="relative">
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
                    <Button disabled={transcript === ""} type="submit" size="icon">
                      <SendHorizontal className="size-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center p-3 pt-0">
                  {imagePreviews.map((image, index) => (
                    <div key={index} className="relative mr-2 mb-2">
                      <img src={image.path} alt={`Preview ${index}`} className="h-16 w-16 rounded-md" />
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
          </div>
        </div>
      </div>
    </div>
  )
}

function LineChartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  )
}


function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}