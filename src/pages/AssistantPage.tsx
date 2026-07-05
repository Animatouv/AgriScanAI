import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatbotResponse, faqData } from "@/lib/mock-ai";
import { Send, Bot, User, Leaf, Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "bot";
  content: string;
}

const AssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hello! 🌾 I'm your farming assistant. Ask me about crop diseases, fertilizers, pest management, or yield improvement! You can also use the 🎤 button to speak." },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setTimeout(() => {
      const reply = chatbotResponse(msg);
      setMessages((prev) => [...prev, { role: "bot", content: reply }]);
    }, 600);
  };

  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages(prev => [...prev, { role: "bot", content: "Sorry, voice input is not supported in your browser. Try Chrome or Edge." }]);
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const suggestedQuestions = faqData.slice(0, 4).map((f) => f.question);

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">🤖 AI Farming Assistant</h1>
          <p className="mt-1 text-muted-foreground">Ask questions using text or voice about crop diseases, fertilizers, and farming</p>
        </motion.div>

        <Card className="mt-8">
          <CardHeader className="border-b">
            <CardTitle className="font-display flex items-center gap-2 text-base">
              <Bot className="h-5 w-5 text-primary" /> AgriScan Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[400px] overflow-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "bot" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Leaf className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                      <User className="h-4 w-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="border-t p-4">
              {messages.length <= 1 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:bg-muted transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant={isListening ? "destructive" : "outline"}
                  onClick={toggleVoice}
                  title="Voice input"
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Input
                  placeholder="Ask about farming..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button size="icon" onClick={() => handleSend()} disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssistantPage;
