import axios from "axios";
import { createContext, useEffect, useState } from "react";
import Loader from '@/components/Loader'

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

    useEffect(() => {
        const savedHistory = JSON.parse(sessionStorage.getItem('chatHistory')) || [];
        setHistory(savedHistory);
    }, []);


    const onSent = async (prompt) => {
        console.log('prompt', prompt);
        setLoading(true);
    
        const userMessage = { role: "user", message: input };
        setResultData((prevResultData) => [...prevResultData, userMessage]);
    
        setShowResult(true);
        setRecentPrompt(input);
        setInput("");
        const loadingPlaceholder = { role: "AI", message: "loading..." };
        setResultData((prevResultData) => [...prevResultData, loadingPlaceholder]);
    
        try {
            let response;
            if (prompt !== undefined) {
                response = await axios.post('/api/medifyai', { transcript: input, dataimage: prompt, history: history });
            } else {
                response = await axios.post('/api/medifyai', { transcript: input, history: history });
            }
    
            const data = await response.data;
            const newHistory = data.newHistory;
            setHistory(newHistory);
            sessionStorage.setItem('chatHistory', JSON.stringify(newHistory));
    
            const aiResponse = { role: "AI", message: response.data?.response };
    
            // Replace the loading placeholder with the actual AI response
            setResultData((prevResultData) => {
                const updatedData = [...prevResultData];
                updatedData[updatedData.length - 1] = aiResponse;
                return updatedData;
            });
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = { role: "AI", message: "An error occurred. Please try again later." };
    
            // Replace the loading placeholder with the error message
            setResultData((prevResultData) => {
                const updatedData = [...prevResultData];
                updatedData[updatedData.length - 1] = errorMessage;
                return updatedData;
            });
        } finally {
            setLoading(false);
        }
    };
    

    // onSent("Hello")

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
        setImages
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )




}

export default ContextProvider