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
    const [images,setImages] = useState([])

    useEffect(() => {
        const savedHistory = JSON.parse(sessionStorage.getItem('chatHistory')) || [];
        setHistory(savedHistory);
      }, []);

const delayPara = (index,nextWord) => {
setTimeout(function () {
    setResultData((prevResultData) => {
        const updatedData = [...prevResultData];
        updatedData[updatedData.length - 1] = prevResultData + nextWord;
        return updatedData;
    });
},75*index)
}

    const onSent = async (prompt) => {
        setLoading(true)
        // setResultData("")
        const userMessage = { role: "user", message: input };
        setResultData((prevResultData) => [...prevResultData, userMessage]);

        setShowResult(true)
        setRecentPrompt(input)
        setInput("")
        const loadingPlaceholder = { role: "AI", message: "loading..." };
        setResultData((prevResultData) => [...prevResultData, loadingPlaceholder]);

    
        
        const response = await axios.post('/api/medifyai', { transcript: input,images:images, history:history });
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
        setLoading(false)

    }

    // onSent("Hello")

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
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