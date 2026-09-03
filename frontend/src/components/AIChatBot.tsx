import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  options?: { label: string; action: () => void }[];
  timestamp: string;
}

export const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages: Message[] = [
    {
      id: 'm_1',
      sender: 'bot',
      text: 'Namaste! Main hoon BiteBot, aapka personal BiteTown AI Food Assistant. Aaj kya khane ka mann hai?',
      options: [
        { label: '🔥 Bestseller Pizza/Burgers', action: () => handleBotQuickOption('Show me best fast food') },
        { label: '🍛 North Indian Thali & Meals', action: () => handleBotQuickOption('Recommend meal thalis') },
        { label: '📍 Where is my order?', action: () => handleBotQuickOption('Track my active order') },
        { label: '🎟️ Check Today Promo Offers', action: () => handleBotQuickOption('Any coupon available?') },
      ],
      timestamp: 'Just now',
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleBotQuickOption = (queryText: string) => {
    processUserPrompt(queryText);
  };

  const processUserPrompt = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // AI Intent Classifier & Contextual Logic
    setTimeout(() => {
      const lower = text.toLowerCase();
      let botResponseText = '';
      let botOptions: { label: string; action: () => void }[] | undefined = undefined;

      if (lower.includes('order') || lower.includes('track') || lower.includes('status')) {
        botResponseText = 'Aapka latest order prepare ho chuka hai aur delivery rider Restaurant se pick kar raha hai (ETA: ~18 mins).';
        botOptions = [
          { label: 'Live GPS Map Track', action: () => { setIsOpen(false); navigate('/orders'); } },
          { label: 'Call Delivery Restaurant', action: () => alert('Connecting to Delivery Executive...') },
        ];
      } else if (lower.includes('burger') || lower.includes('pizza') || lower.includes('fast food')) {
        botResponseText = 'Pizza Palace ka Margherita & Burger Kingcraft ka Cheesy Blast Burger trending me hai!';
        botOptions = [
          { label: 'Open Pizza Palace (₹450 for two)', action: () => { setIsOpen(false); navigate('/Restaurants/rest_1'); } },
          { label: 'Open Burger Kingcraft', action: () => { setIsOpen(false); navigate('/Restaurants/rest_2'); } },
        ];
      } else if (lower.includes('meal') || lower.includes('thali') || lower.includes('biryani')) {
        botResponseText = 'Biryani By Kilo ki Dum Biryani aur Punjab Grill ki Shahi Thali top-rated hain (4.8⭐).';
        botOptions = [
          { label: 'Explore Biryani By Kilo', action: () => { setIsOpen(false); navigate('/Restaurants/rest_3'); } },
          { label: 'View Punjab Grill Menu', action: () => { setIsOpen(false); navigate('/Restaurants/rest_6'); } },
        ];
      } else if (lower.includes('coupon') || lower.includes('offer') || lower.includes('discount')) {
        botResponseText = 'Use code "BITENEW50" on checkout for 50% discount up to ₹150 on orders above ₹299!';
        botOptions = [
          { label: 'Go to Cart', action: () => { setIsOpen(false); navigate('/cart'); } },
        ];
      } else {
        botResponseText = `Main aapke liye BiteTown ke 32+ Restaurants me se best dishes recommend kar sakta hoon. Quick options me se chuniye:`;
        botOptions = [
          { label: '🍕 Fast Food', action: () => handleBotQuickOption('Show fast food') },
          { label: '🥤 Chilled Beverages', action: () => handleBotQuickOption('Recommend cold drinks') },
          { label: '🏠 Manage Delivery Address', action: () => { setIsOpen(false); navigate('/profile'); } },
        ];
      }

      const botReply: Message = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: botResponseText,
        options: botOptions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 600);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    processUserPrompt(inputMessage);
  };

  return (
    <>
      {/* Floating AI Bot Launch Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-brand-600 to-orange-400 text-white rounded-full shadow-2xl shadow-brand-500/40 hover:scale-105 active:scale-95 transition-all"
        >
          <Bot className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
          </span>
        </button>
      </div>

      {/* AI Bot Chat Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md h-[88vh] sm:h-[620px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center shadow-xs">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-extrabold tracking-tight">BiteBot AI</h3>
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded-full text-[9px] font-black">
                      <Sparkles className="w-2.5 h-2.5" /> 24/7 AI
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Online • Ready to recommend
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages(initialMessages)}
                  title="Reset Chat"
                  className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-xl bg-brand-500 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[80%] space-y-2`}>
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-brand-500 text-white rounded-tr-xs font-medium'
                          : 'bg-white border border-gray-100 text-zinc-800 rounded-tl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`block text-[9px] mt-1 text-right ${
                          msg.sender === 'user' ? 'text-orange-100' : 'text-zinc-400'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Interactive Action Badges / Quick Replies */}
                    {msg.options && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={opt.action}
                            className="text-[11px] font-bold px-3 py-1.5 bg-white border border-brand-200 text-brand-600 rounded-full hover:bg-brand-50 shadow-xs active:scale-95 transition-all text-left"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-xl bg-zinc-800 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-zinc-400 text-xs pl-2">
                  <div className="w-6 h-6 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about dishes, orders, coupons..."
                className="flex-1 bg-gray-100 border-none rounded-2xl px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white rounded-2xl transition-all shadow-md shadow-brand-500/25 active:scale-95 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};