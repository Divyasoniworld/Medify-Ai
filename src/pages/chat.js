import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MainNav from "@/components/MainNav";
import { X, Camera, Menu, Mic, Pill, Plus, SendHorizontal, Image, MicOff, CircleStop, CircleX, History, Copy, Volume2, Pause, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useContext, useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import axios from "axios";
import Cards from "@/components/Cards";
import { Context } from "@/context/ContextProvider";
import { useToast } from "@/context/ToastProvider"
import { getAuth } from "firebase/auth"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

export default function chat() {

  const auth = getAuth()
  const router = useRouter()
  const showToast = useToast()
  const { user, setUser } = useAuth();
  const chatContainerRef = useRef(null);
  const utteranceRef = useRef(null);

  const [recognition, setRecognition] = useState(null);
  const [permission, setPermission] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [copied, setCopied] = useState(false);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false)

  const { onSent, showResult, setShowResult, resultData, setResultData, setInput, input, } = useContext(Context)

  useEffect(() => {
    let sesstionUser = JSON.parse(localStorage.getItem("medifyUser"))
    setUser(sesstionUser)

  }, [auth, router])

  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    // Check if the alert has already been shown
    const hasAlertBeenShown = localStorage.getItem('chatAlertShown');

    if (!hasAlertBeenShown) {
      // Show the alert
      setShowAlert(true);

      // Set the flag in localStorage to prevent showing the alert again
      localStorage.setItem('chatAlertShown', 'true');
    }
  }, []);


  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100); // Adjust the timeout duration if needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (resultData.length > 0) {
      setShowResult(true);
      const timestamp = new Date().getTime();
      const dataToStore = {
        data: resultData,
        timestamp: timestamp,
      };
      localStorage.setItem("chatList", JSON.stringify(dataToStore));
      scrollToBottom(); // Ensure we scroll to the bottom after setting resultData
    }
  }, [resultData]);


  useEffect(() => {
    const storedData = localStorage.getItem("chatList");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const currentTime = new Date().getTime();
      const dataAge = currentTime - parsedData.timestamp;

      if (dataAge < 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
        setResultData(parsedData.data);
      } else {
        localStorage.removeItem("chatList");

        setResultData([]); // Clear the data if it's older than 24 hours
      }
    }
  }, []);




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


  //get browser name

  const getBrowserName = () => {
    const { userAgent } = navigator;
    
    if (/firefox|fxios/i.test(userAgent)) {
      return 'Firefox';
    } else if (/chrome|crios|crmo/i.test(userAgent)) {
      return 'Chrome';
    } else if (/safari/i.test(userAgent) && !/chrome|crios|crmo/i.test(userAgent)) {
      return 'Safari';
    } else if (/msie|trident/i.test(userAgent)) {
      return 'Internet Explorer';
    } else if (/edg/i.test(userAgent)) {
      return 'Edge';
    } else if (/opera|opr\//i.test(userAgent)) {
      return 'Opera';
    }
    
    return 'Unknown';
  };
  
  // Example usage
  console.log(`Browser: ${getBrowserName()}`);
  



  //copy message
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text.trim()).then(() => {
      setCopied(index);
      setTimeout(() => {
        setCopied(false);
      }, 2000); // 2 seconds
    });
  };

  //speak function
  const handleSpeak = (text, index) => {
    let browserName = getBrowserName()
    
    if (speakingMessageIndex === index) {
      // Stop the current speech
      window.speechSynthesis.cancel();
      setSpeakingMessageIndex(null);
      return;
    }

    console.log('spech text', text)

    // Regex to remove emojis
    const emojiRegex = /([\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{1FC00}-\u{1FFFF}\u{2000}-\u{2BFF}\u{A700}-\u{A71F}\u{FE00}-\u{FE0F}\u{E0100}-\u{E01EF}])/gu;
    const asteriskRegex = /\*/g;
    let cleanedText = text.replace(asteriskRegex, '');

    // Remove emojis from the text without altering spaces
    const cleanText = cleanedText.replace(emojiRegex, '');

    const maxChunkLength = 200;
    const textChunks = cleanText.match(new RegExp('.{1,' + maxChunkLength + '}', 'g'));

    let voices = window.speechSynthesis.getVoices();
    console.log('voices', voices)
    let femaleVoice;
    if (browserName == 'safari') {
      femaleVoice = voices.find(voice => voice.name.includes('Samantha') || voice.name.includes('Google UK English Female'));
    }else{
      femaleVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('Google UK English Female'));
    }

    if (!femaleVoice) {
      femaleVoice = voices.find(voice => voice.lang === 'en-US'); 
    }

    const speakChunk = (chunk, index) => {
      const newUtterance = new SpeechSynthesisUtterance(chunk);

      newUtterance.voice = femaleVoice;
      newUtterance.lang = 'en-US';
      newUtterance.pitch = 1.1;
      newUtterance.rate = 1.05;
      newUtterance.volume = 1;

      newUtterance.onend = () => {
        if (index < textChunks.length - 1) {
          speakChunk(textChunks[index + 1], index + 1);
        } else {
          setSpeakingMessageIndex(null);
        }
      };

      window.speechSynthesis.speak(newUtterance);
    };

    // Stop any ongoing speech only if a new message is being spoken
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
    }

    // Start speaking the first chunk
    speakChunk(textChunks[0], 0);
    setSpeakingMessageIndex(index);
    utteranceRef.current = textChunks[0];
  };

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Ensure voices are loaded before speaking
  window.speechSynthesis.onvoiceschanged = function () {
    console.log('Voices changed');
  };


  // Ensure voices are loaded before speaking
  window.speechSynthesis.onvoiceschanged = function () {
    console.log('Voices changed');
  };



  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setIsUploading(true)
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setPreview(response.data.url);
        setFileName(response.data.url);
        setIsUploading(false)
      }
    } catch (error) {
      setIsUploading(false)
      console.error('Error uploading file:', error);
    }


  };

  const handleUpload = async () => {
    onSent(fileName)
    setInput("")
  };


  const handleImageDelete = (index) => {
    setPreview("");
  };

  const handleMicPermition = () => {
    console.log("permission", permission)
    if (permission == "denied") {
      showToast("Microphone permission denied. Please enable it in your browser settings.")
    }
  }



  //formated response
  const formatText = (text) => {
    // Replace **bold** with <strong>bold</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Replace - or * list item with <li>list item</li>
    text = text.replace(/^[*-] (.*)/gm, '<li>$1</li>');

    // Handle URLs and add light blue color
    text = text.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #595bcc;">$1</a><br>'
    );


    text = text.replace(/^\s{4}[*-] (.*)/gm, '<li style="margin-left:20px;">$1</li>');

    // Wrap list items in <ul> if there are list items
    if (text.includes('<li>')) {
      text = text.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>'); // Wrap <li> items in <ul> tags
      text = text.replace(/<\/ul><ul>/g, ''); // Merge consecutive <ul> tags
    }

    // Replace new lines with <br> tags
    text = text.replace(/\n/g, '<br>');

    // Render as HTML
    return { __html: text };
  };

  const handleNewChat = () => {
    setShowResult(false)
    setResultData([])
    localStorage.removeItem("chatHistory");
    localStorage.removeItem("chatList");
    setInput(""); // Clear the chat input
    setIsSidebarOpen(false); // Close the sidebar
  }

  const handleKeyUpSubmit = (e) => {
    if (input.trim() != "") {
      if (e._reactName == "onClick") {
        e.preventDefault(); // Prevent the default action of adding a new line
        if (preview !== "") {
          handleUpload();
        } else {
          onSent();
        }
        setPreview("");
      } else {
        if (e.key === "Enter") {
          if (input.trim() === '') {
            // Do nothing or handle empty input scenario if needed
            setInput("")
            return;
          }
        }
        if (e.key === 'Enter' && !e.shiftKey && input !== "") {
          e.preventDefault(); // Prevent the default action of adding a new line
          if (preview !== "") {
            if (input.trim() === '') {
              // Do nothing or handle empty input scenario if needed
              return;
            }
            handleUpload();
          } else {
            onSent();
          }
          setPreview("");
        }
      }
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
          <div className="flex-1 overflow-auto pt-16 p-4 custom-scrollbar" ref={chatContainerRef}>
            <div className="grid gap-4">

              {showResult ? (
                resultData.map((chat, index) => {
                  if (chat.role !== "AI") {
                    return (
                      <div key={index} className="flex items-start gap-3 justify-end">
                        <div className="bg-primary rounded-lg p-3 max-w-[80%] text-primary-foreground">
                          {
                            chat.image != "" ?
                              (
                                <div className="w-16 h-32 md:w-20 md:h-30 mb-2">
                                  <img
                                    src={chat.image}
                                    alt="User Image"
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                </div>
                              ) : ""
                          }

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
                                  <Button variant="outline" size="icon" onClick={() => handleCopy(chat.message, index)}>
                                    {copied == index ? <Check className="w-4 h-4 text-[#595bcc]" /> : <Copy size={24} className="w-4 h-4" />}
                                  </Button>
                                  {
                                    (speakingMessageIndex == index) ?
                                      (
                                        <Button variant="outline" size="icon">
                                          <Pause onClick={() => handleSpeak(chat.message, index)} className="w-4 h-4" />
                                        </Button>
                                      ) : (
                                        <Button variant="outline" size="icon" onClick={() => handleSpeak(chat.message, index)}>
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
                <>
                  <Cards />
                 
                </>

              )}
            </div>

          </div>
          <div className="sticky bottom-0 bg-card p-4">
            <div className="relative">
              <div
                className="relative chat-box md:mt-4 overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
                x-chunk="dashboard-03-chunk-1"
              >
                <Label htmlFor="message" className="sr-only">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={input}
                  onKeyDown={handleKeyUpSubmit}
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
                    <Button disabled={input.trim() === ""} size="icon" onClick={handleKeyUpSubmit}>
                      <SendHorizontal className="size-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center p-3 pt-0">
                  <div className="relative mr-2 mb-2">

                    {
                      !isUploading ?
                        (
                          preview ?
                            (
                              <>
                                <img src={preview} alt="Preview" className="h-16 w-16 rounded-md" />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleImageDelete()}
                                  className="cancel_preview absolute top-0 right-7 m-1"
                                >
                                  <CircleX className="h-4 w-4" />
                                </Button>
                              </>
                            )
                            : ""
                        ) :
                        <Skeleton width={64} height={64} style={{ border: "3px solid rgb(212 212 212)" }} />
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="text-sm md:text-md dark:text-white text-slate-600 flex justify-center items-center mt-2">
              General info only. Consult a doctor for advice.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
