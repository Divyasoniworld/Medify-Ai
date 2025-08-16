import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const Context = createContext()

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("")
    const [prevPrompts, setPrevPrompts] = useState([])
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState([])
    const [history, setHistory] = useState([]);
    const [images, setImages] = useState([])

    const [language, setLanguage] = useState("English"); // default

    useEffect(() => {
        const savedLang = localStorage.getItem("lang");
        if (savedLang) {
            setLanguage(savedLang);
        }
    }, []);



    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        setHistory(savedHistory);
    }, []);


    // In ContextProvider.js

    const onSent = async (prompt) => {
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(input);

        const userMessage = { role: "user", message: input, image: prompt };

        // Add the user's message and an empty placeholder for the AI's streaming response
        const aiResponsePlaceholder = { role: "AI", message: "" };
        setResultData((prev) => [...prev, userMessage, aiResponsePlaceholder]);

        setInput("");

        try {
            const response = await fetch('/api/medifyai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transcript: input,
                    dataimage: prompt,
                    history: history
                }),
            });

            if (!response.body) {
                throw new Error("Response body is null");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            // Continuously read from the stream
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    // The stream is finished, we can stop
                    break;
                }

                const chunk = decoder.decode(value);
                // SSE format is "data: {...}\n\n", so we parse it
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const jsonString = line.substring(6);
                        try {
                            const parsedChunk = JSON.parse(jsonString);
                            if (parsedChunk.text) {
                                // Update the last message in the resultData array with the new text
                                setResultData((prev) => {
                                    let newResultData = [...prev];
                                    let lastMessage = newResultData[newResultData.length - 1];
                                    lastMessage.message += parsedChunk.text;
                                    return newResultData;
                                });
                            }
                        } catch (e) {
                            // Ignore lines that are not valid JSON
                        }
                    }
                }
            }

            // After the stream is done, you might want to update the history
            // Note: Your current API doesn't send back the new history, this is something to add
            // For now, we'll manually add the final message to history
            setHistory((prevHistory) => [
                ...prevHistory,
                { role: "user", parts: [{ text: input }] },
                { role: "model", parts: [{ text: "The final streamed response" }] } // You'll need a way to get the full final text here
            ]);


        } catch (error) {
            console.error('Streaming Error:', error);
            const errorMessage = { role: "AI", message: "I apologize, but an error occurred. Please try again." };
            // Replace the placeholder with the error message
            setResultData((prev) => {
                const updatedData = [...prev];
                updatedData[updatedData.length - 1] = errorMessage;
                return updatedData;
            });
        } finally {
            setLoading(false);
        }
    };



    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        setShowResult,
        loading,
        resultData,
        setResultData,
        input,
        setInput,
        images,
        setImages,
        language,
        setLanguage
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )


}

export default ContextProvider