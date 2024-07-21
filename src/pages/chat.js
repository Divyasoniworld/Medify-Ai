import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MainNav from "@/components/MainNav";
import { Camera, Menu, Mic, Pill, Plus, SendHorizontal, Image, MicOff, CircleStop, CircleX, History, Copy, Volume2, Pause } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { useContext, useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import Cards from "@/components/Cards";
import { Context } from "@/context/ContextProvider";
import Loader from "@/components/Loader";
import { useToast } from "@/context/ToastProvider"
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function chat() {

  const { theme, setTheme } = useTheme();
  const chatContainerRef = useRef(null);
  const auth = getAuth()
  const router = useRouter()
  const { user, setUser, login, logout } = useAuth();
  const showToast = useToast()
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setUser(user)
  //     } else {
  //       router.push("/")
  //     }
  //   })

  //   return () => unsubscribe()

  // }, [auth, router])


  const { onSent, recentPrompt, showResult, setShowResult, loading, resultData, setResultData, setInput, input, images, setImages } = useContext(Context)

  const handleThemeChange = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [resultData]);

  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [permission, setPermission] = useState(null);
  const [isListening, setIsListening] = useState(false);
  console.log('isListening', isListening)
  const [imagePreviews, setImagePreviews] = useState([]);
  // const [chatMessages, setChatMessages] = useState(chatData);
  const [showCards, setShowCards] = useState(true);

  const [chatHistory, setChatHistory] = useState([])

  console.log('chatHistory', chatHistory)
  // console.log('imagePreviews', imagePreviews)

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('SpeechRecognition API is not supported in this browser.');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-USA';

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    navigator.permissions.query({ name: 'microphone' }).then((permissionStatus) => {
      setPermission(permissionStatus.state);
      permissionStatus.onchange = () => {
        setPermission(permissionStatus.state);
      };
    });
  }, [setInput]);

  const startRecognition = () => {
    if (recognition && !isListening) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopRecognition = () => {
    if (recognition && isListening) {
      recognition.stop();  // Use stop instead of onend to properly stop recognition
      setIsListening(false);
    }
  };



  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text.trim()).then(() => {
    });
  };

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [utterance, setUtterance] = useState(null);

  const handleSpeak = (text) => {
    if (isSpeaking) {
      // Stop the current speech
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Simplified regex to remove emojis
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{1FC00}-\u{1FFFF}\u{2000}-\u{2BFF}\u{A700}-\u{A71F}\u{FE00}-\u{FE0F}\u{E0100}-\u{E01EF}]/gu;

    // Remove emojis from the text
    const cleanText = text.replace(emojiRegex, '');

    // Create SpeechSynthesisUtterance
    const newUtterance = new SpeechSynthesisUtterance(cleanText);

    // Fetch voices and select a female voice
    let voices = window.speechSynthesis.getVoices();
    let femaleVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('Google UK English Female'));

    if (!femaleVoice) {
      femaleVoice = voices.find(voice => voice.lang === 'en-US'); // Fallback to a default English voice if no specific female voice found
    }

    newUtterance.voice = femaleVoice;
    newUtterance.lang = 'en-US';
    newUtterance.pitch = 1;
    newUtterance.rate = 1;
    newUtterance.volume = 1;

    newUtterance.onend = () => {
      setIsSpeaking(false);
    };

    // Speak the text
    window.speechSynthesis.speak(newUtterance);
    setIsSpeaking(true);
    setUtterance(newUtterance);
  };
  // Ensure voices are loaded before speaking
  window.speechSynthesis.onvoiceschanged = function () {
    console.log('Voices changed');
    // You can call handleSpeak here if needed or add an event listener for when the voices are loaded
  };


  // Ensure voices are loaded before speaking
  window.speechSynthesis.onvoiceschanged = function () {
    console.log('Voices changed');
    // You can call handleSpeak here if needed or add an event listener for when the voices are loaded
  };



  const [imageData, setImageData] = useState([])
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };
  const handleUpload = async () => {

    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        console.log('response', response.data.fileName)
        setFileName(response.data.fileName);
        onSent(response.data?.fileName)
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


  const handleImageDelete = (index) => {
    setPreview("");
  };

  const handleMicPermition = () => {
    console.log("permission", permission)
    if (permission == "denied") {
      // toast({
      //   description:
      //     "Microphone permission denied. Please enable it in your browser settings.",

      // });
      showToast("Microphone permission denied. Please enable it in your browser settings.")
    }
  }

  const handleStopSpeaking = () => {
    if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    } else {
        handleSpeak("Your text here"); // Replace with the text you want to speak
    }
};


  console.log('images', images)



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

  const handleNewChat = () => {
    setShowResult(false)
    setResultData([])
    sessionStorage.removeItem("chatHistory");
    setInput(""); // Clear the chat input
    setIsSidebarOpen(false); // Close the sidebar
  }

  const handleKeyUpSubmit = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && input !== "") {
      e.preventDefault(); // Prevent the default action of adding a new line
      if (preview !== "") {
        handleUpload();
      } else {
        onSent();
      }
      setPreview("");
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex">
        <aside className="w-14 flex-col border-r bg-background sticky hidden md:flex top-0 h-screen">
          <nav className="flex flex-col items-center gap-4 px-2 py-5">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
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
                    <Button variant="secondary" onClick={handleNewChat}>
                      <Plus className='mr-2 size-4 ' />New Chat
                    </Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </nav>

        </aside>
        <div className="main-chat-div flex-1 flex flex-col">
          <MainNav />
          <div className="flex-1 overflow-auto pt-16 p-4" ref={chatContainerRef}>
            <div className="grid gap-4">
              {showResult ? (
                resultData.map((chat, index) => {
                  if (chat.role !== "AI") {
                    return (
                      <div key={index} className="flex items-start gap-3 justify-end">
                        <div className="bg-primary rounded-lg p-3 max-w-[80%] text-primary-foreground">
                          <p className="text-sm">{chat.message}</p>
                        </div>
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user?.photoURL} alt="profile" />
                          <AvatarFallback>Me</AvatarFallback>
                        </Avatar>
                      </div>
                    );
                  } else {
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                          {
                            typeof chat.message === 'string' && (
                              <div dangerouslySetInnerHTML={formatText(chat.message?.trim())} />
                            )
                          }
                          {
                            chat.message == "loading..." ? "" :
                              (
                                <div className="flex gap-2 mt-2">
                                  <Button variant="outline" size="icon" onClick={() => handleCopy(chat.message)}>
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                  {
                                    isSpeaking ?
                                      (
                                        <Button variant="outline" size="icon">
                                          <Pause onClick={handleStopSpeaking} className="w-4 h-4" />
                                        </Button>
                                      ) : (
                                        <Button variant="outline" size="icon" onClick={() => handleSpeak(chat.message)}>
                                          <Volume2 className="w-4 h-4" />
                                        </Button>
                                      )
                                  }

                                </div>
                              )
                          }
                        </div>
                      </div>
                    );
                  }
                })
              ) : (
                <Cards />
              )}
            </div>

          </div>
          <div className="sticky bottom-0 bg-card p-4">
            <div className="relative">
              <div
                // onSubmit={handleSubmit}
                className="relative chat-box md:mt-4 overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
                x-chunk="dashboard-03-chunk-1"
              >
                <Label htmlFor="message" className="sr-only">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={input}
                  onKeyPress={handleKeyUpSubmit}
                  onChange={(e) => {
                    setInput(e.target.value);
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
                            onChange={handleFileChange}
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
                            onChange={handleFileChange}
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
                            // onClick={isListening ? stopRecognition : startRecognition}
                            // onClick={startRecognition}
                            className={isListening ? "bg-red-500 hover:bg-red-500" : ""}
                          >
                            {permission == 'denied' ? <MicOff className="size-5" onClick={handleMicPermition} /> : (isListening) ? <CircleStop onClick={stopRecognition} className="size-5" /> : <Mic onClick={startRecognition} className="size-5" />}
                          </Button>
                        </label>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {isListening ? "Stop Listening" : "Start Listening"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="ml-auto flex items-center space-x-2" >
                    <Button disabled={input === ""} size="icon" onClick={() => { preview != "" ? handleUpload() : onSent(), setPreview("") }}>
                      <SendHorizontal className="size-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center p-3 pt-0">
                  {/* {images.map((image, index) => ( */}
                  <div className="relative mr-2 mb-2">
                    {
                      preview != "" ? <img src={preview} alt="Preview" className="h-16 w-16 rounded-md" /> : ""
                    }

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleImageDelete()}
                      className="cancel_preview absolute top-0 right-7 m-1"
                    >
                      <CircleX className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* ))} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
