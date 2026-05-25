import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoMdSend } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaMicrophone, FaStopCircle, FaChevronRight, FaRobot, FaUser } from "react-icons/fa";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Header from "../Components/Header";
import { Link } from "react-router-dom";

const ChatbotPage = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I am your AI Health Assistant. Describe your symptoms, and I'll help you identify potential conditions and recommend specialists." }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (transcript && !listening) {
      handleSendMessage(transcript);
      resetTranscript();
    }
  }, [transcript, listening]);

  const runGeminiAPI = async (userPrompt) => {
    try {
      const { data } = await axios.post(
        "http://localhost:2000/api/v1/ai/chat",
        { prompt: userPrompt }
      );

      if (data.success) {
        return { text: data.response, doctors: data.suggestedDoctors || [] };
      }
      return { text: "No response from AI.", doctors: [] };
    } catch (error) {
      console.error("Error fetching response:", error);
      return { text: "Error fetching response from server.", doctors: [] };
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    setLoading(true);
    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    const data = await runGeminiAPI(text);
    const botMessage = { sender: "bot", text: data.text, doctors: data.doctors };
    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
  };

  const handleVoiceInput = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening();
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser does not support speech recognition.</span>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col h-[750px] w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          {/* Header */}
          <div className="bg-blue-600 p-6 flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                <FaRobot />
              </div>
              <div>
                <h1 className="text-xl font-bold">HealthAI Assistant</h1>
                <p className="text-blue-100 text-xs">Always active for your health</p>
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"} items-end space-x-2`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1 ${
                    msg.sender === "user" ? "bg-blue-600 text-white ml-2" : "bg-white text-blue-600 shadow-sm mr-2"
                  }`}>
                    {msg.sender === "user" ? <FaUser /> : <FaRobot />}
                  </div>
                  
                  <div className="flex flex-col">
                    <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                    }`}>
                      {msg.text}
                    </div>

                    {msg.doctors && msg.doctors.length > 0 && (
                      <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-left-4 duration-500">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Matching Specialists</p>
                        {msg.doctors.map((doc) => (
                          <Link 
                            key={doc._id}
                            to={`/book-appointment/${doc._id}`}
                            className="flex items-center p-3 bg-white border border-slate-100 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group"
                          >
                            <img src={doc.image} alt={doc.name} className="w-10 h-10 rounded-full object-cover mr-3" />
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600">{doc.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">{doc.speciality}</p>
                            </div>
                            <FaChevronRight className="text-slate-300 text-xs transition-transform group-hover:translate-x-1" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-2">
                  <AiOutlineLoading3Quarters className="animate-spin text-blue-600" />
                  <span className="text-sm text-slate-500 font-medium">Analyzing symptoms...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-slate-100">
            <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
              <button
                onClick={handleVoiceInput}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  listening ? "bg-red-100 text-red-600 animate-pulse" : "bg-white text-slate-400 hover:bg-white hover:text-blue-600 shadow-sm"
                }`}
              >
                {listening ? <FaStopCircle size={20} /> : <FaMicrophone size={20} />}
              </button>
              
              <input
                type="text"
                placeholder="Describe how you're feeling..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 text-sm py-2"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputText)}
              />
              
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={loading || !inputText.trim()}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  !inputText.trim() || loading 
                  ? "bg-slate-200 text-slate-400" 
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                }`}
              >
                 <IoMdSend size={20} />
              </button>
            </div>
            {listening && <p className="text-center text-xs text-blue-500 font-medium mt-2">Listening: {transcript}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
