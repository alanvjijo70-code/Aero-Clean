import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  Sparkles,
  Bot,
  X,
  Send,
  RotateCcw,
  AlertCircle,
  ArrowUp,
  Key,
  Check
} from 'lucide-react';
import {
  sendChatMessage,
  ChatMessage,
  getActiveApiKey,
  setActiveApiKey,
  isLiveGeminiActive
} from '../../services/geminiChatService.js';

const STARTER_PROMPTS = [
  'How does the 4-stage hybrid cleaning cycle work?',
  'What are the safety systems preventing building collisions?',
  'What are the cost savings vs human cleaning?'
];

export const GeminiChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState('');
  const [hasLiveKey, setHasLiveKey] = useState<boolean>(() => isLiveGeminiActive());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync key state on open
  useEffect(() => {
    setHasLiveKey(isLiveGeminiActive());
    const existingKey = getActiveApiKey();
    if (existingKey) {
      setCustomKeyInput(existingKey);
    }
  }, [isOpen, showKeyConfig]);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus textarea when opened on desktop
      if (window.innerWidth > 640 && !showKeyConfig) {
        setTimeout(() => textareaRef.current?.focus(), 250);
      }
    }
  }, [isOpen, messages, isLoading, showKeyConfig]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    setInputMessage('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(text, messages);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date()
      };

      setMessages([...updatedHistory, assistantMessage]);
    } catch (err: any) {
      console.error('[GeminiChatWidget] Send error:', err);
      setErrorMessage(err?.message || 'Failed to receive a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setErrorMessage(null);
  };

  const handleSaveKey = () => {
    const trimmed = customKeyInput.trim();
    setActiveApiKey(trimmed ? trimmed : null);
    setHasLiveKey(Boolean(trimmed));
    setShowKeyConfig(false);
  };

  const handleClearSavedKey = () => {
    setActiveApiKey(null);
    setCustomKeyInput('');
    setHasLiveKey(isLiveGeminiActive());
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. FLOATING ACTION BUTTON (FAB)                                            */}
      {/* ========================================================================= */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className={`relative p-4 rounded-full flex items-center justify-center shadow-glass transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            isOpen
              ? 'bg-surface text-text-primary border border-primary/50 shadow-glow-cyan'
              : 'bg-gradient-to-r from-primary via-accent to-secondary text-background font-bold shadow-[0_0_25px_rgba(0,217,255,0.45)] hover:shadow-[0_0_35px_rgba(0,217,255,0.7)]'
          }`}
          aria-label={isOpen ? 'Close AI Assistant' : 'Open Gemini AI Assistant'}
          title={isOpen ? 'Close AI Assistant' : 'Chat with AeroClean AI Assistant'}
        >
          {/* Subtle pulse ring around button when closed */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-primary/30 animate-ping pointer-events-none" />
          )}

          {isOpen ? (
            <X className="w-6 h-6 text-primary transition-transform duration-200" />
          ) : (
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-6 h-6 text-background fill-background animate-pulse" />
            </div>
          )}
        </motion.button>
      </div>

      {/* ========================================================================= */}
      {/* 2. CHAT POPOVER / DRAWER                                                  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] max-w-sm h-[580px] max-h-[82vh] flex flex-col rounded-2xl bg-[#0D1B2E]/95 backdrop-blur-xl border border-primary/30 shadow-2xl overflow-hidden max-sm:bottom-0 max-sm:right-0 max-sm:w-full max-sm:h-[88vh] max-sm:rounded-b-none"
          >
            {/* Ambient Interior Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

            {/* Chat Header */}
            <div className="relative z-10 px-4 py-3.5 bg-surface-secondary/80 border-b border-border/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/30 text-primary shadow-sm">
                  <Bot className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-display font-bold text-text-primary leading-tight">
                      AeroClean AI Assistant
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                      {hasLiveKey ? 'Gemini 2.5 Flash Live' : 'AI Assistant Online'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowKeyConfig(!showKeyConfig)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    hasLiveKey
                      ? 'text-status-success hover:bg-status-success/15'
                      : 'text-text-muted hover:text-primary hover:bg-white/5'
                  }`}
                  title={hasLiveKey ? 'Gemini API Key active' : 'Configure Gemini API Key'}
                >
                  <Key className="w-4 h-4" />
                </button>

                {messages.length > 0 && (
                  <button
                    onClick={handleClearChat}
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
                    title="Clear conversation"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
                  title="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Key Configuration Popover Drawer */}
            {showKeyConfig && (
              <div className="relative z-20 p-3.5 bg-surface-light border-b border-border text-xs space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary flex items-center gap-1.5 text-xs">
                    <Key className="w-3.5 h-3.5 text-primary" /> Google Gemini API Key
                  </span>
                  <button
                    onClick={() => setShowKeyConfig(false)}
                    className="p-1 rounded text-text-muted hover:text-text-primary"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Enter your Google Gemini API Key for direct live generation with <code className="text-primary font-mono text-[10px]">gemini-2.5-flash</code>. You can also specify <code className="text-primary font-mono text-[10px]">VITE_GEMINI_API_KEY</code> in <code className="text-accent font-mono text-[10px]">client/.env</code>.
                </p>
                <div className="flex gap-2 items-center">
                  <input
                    type="password"
                    value={customKeyInput}
                    onChange={(e) => setCustomKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-background border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/60"
                  />
                  <button
                    onClick={handleSaveKey}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary to-accent text-background font-bold text-xs shadow-glow-cyan"
                  >
                    Save
                  </button>
                  {customKeyInput && (
                    <button
                      onClick={handleClearSavedKey}
                      className="px-2 py-1.5 rounded-xl bg-surface text-text-muted hover:text-status-danger border border-border text-xs"
                      title="Clear key"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Scrollable Message History Area */}
            <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-3.5 text-xs sm:text-sm">
              {/* Empty State Welcome & Starter Chips */}
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-2 py-6 space-y-4">
                  <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/30 text-primary shadow-glow-cyan">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                  <div className="space-y-1.5 max-w-xs">
                    <h4 className="text-sm font-display font-bold text-text-primary">
                      How can I help with AeroClean AI?
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Ask me about autonomous drone flight, the 4-stage hybrid cleaning system, safety features, or building ROI.
                    </p>
                  </div>

                  {/* Starter Prompt Chips */}
                  <div className="w-full space-y-2 pt-2">
                    <span className="text-[10px] font-mono uppercase text-text-muted block text-left">
                      Suggested Inquiries:
                    </span>
                    {STARTER_PROMPTS.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(prompt)}
                        className="w-full text-left p-2.5 rounded-xl bg-surface-light/70 hover:bg-surface-light border border-border/80 hover:border-primary/50 text-text-secondary hover:text-text-primary text-xs transition-all duration-200 flex items-center justify-between group shadow-sm"
                      >
                        <span className="line-clamp-2">{prompt}</span>
                        <ArrowUp className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2 rotate-45" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message List */}
              {messages.map((message) => {
                const isUser = message.role === 'user';
                return (
                  <div
                    key={message.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed shadow-sm ${
                        isUser
                          ? 'bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/25 border border-primary/40 text-text-primary rounded-tr-sm'
                          : 'bg-surface-light/85 border border-border/80 text-text-primary rounded-tl-sm'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        <div className="markdown-chat text-xs sm:text-sm space-y-2">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                              h3: ({ children }) => <h3 className="font-bold text-sm text-text-primary mt-2 mb-1">{children}</h3>,
                              h4: ({ children }) => <h4 className="font-bold text-xs text-text-primary mt-2 mb-1">{children}</h4>,
                              strong: ({ children }) => <strong className="font-bold text-accent">{children}</strong>,
                              ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-1.5 text-text-secondary">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-1.5 text-text-secondary">{children}</ol>,
                              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                              code: ({ children }) => (
                                <code className="px-1.5 py-0.5 rounded bg-background/80 text-primary font-mono text-[11px] border border-primary/20">
                                  {children}
                                </code>
                              ),
                              pre: ({ children }) => (
                                <pre className="p-2.5 rounded-lg bg-background/90 border border-border overflow-x-auto my-2 text-[11px] font-mono text-text-primary">
                                  {children}
                                </pre>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-2 border-primary/60 pl-2.5 py-1 my-2 bg-primary/5 rounded-r text-text-muted text-xs italic">
                                  {children}
                                </blockquote>
                              )
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-text-muted mt-1 px-1">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}

              {/* Typing / Loading Indicator */}
              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="bg-surface-light/85 border border-border/80 rounded-2xl rounded-tl-sm p-3.5 shadow-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" />
                    <span className="text-xs font-mono text-text-muted ml-1.5">
                      {hasLiveKey ? 'Gemini 2.5 Flash is thinking...' : 'AeroClean AI is analyzing...'}
                    </span>
                  </div>
                </div>
              )}

              {/* Error Alert Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{errorMessage}</p>
                    <button
                      onClick={() => handleSendMessage()}
                      className="text-[11px] underline mt-1 font-mono text-status-danger hover:text-white"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Footer */}
            <div className="relative z-10 p-3 bg-surface-secondary/90 border-t border-border/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-end gap-2"
              >
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about drone flight, cleaning stages, ROI..."
                    className="w-full py-2.5 pl-3.5 pr-3 rounded-xl bg-background border border-border focus:border-primary/60 focus:ring-1 focus:ring-primary/60 text-xs sm:text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none transition-colors max-h-28"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className={`p-2.5 rounded-xl font-bold flex items-center justify-center transition-all ${
                    inputMessage.trim() && !isLoading
                      ? 'bg-gradient-to-r from-primary to-accent text-background shadow-glow-cyan hover:scale-105 active:scale-95'
                      : 'bg-surface-light text-text-muted border border-border cursor-not-allowed opacity-50'
                  }`}
                  aria-label="Send message"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] font-mono text-text-muted mt-1.5 px-1">
                <span>Shift + Enter for new line</span>
                <span>{hasLiveKey ? 'Gemini 2.5 Flash' : 'AeroClean AI'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
