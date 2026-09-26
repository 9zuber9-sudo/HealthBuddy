import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  ShieldAlert,
  Send,
  RefreshCw,
  Bot,
  User,
  AlertTriangle,
  Zap,
  MessageSquare,
  Loader2,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';
import type { PageId } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  initGeminiChat,
  sendMessageToGemini,
  resetGeminiChat,
  isGeminiConfigured,
  type ChatMessage,
} from '../services/geminiService';
import { useToast } from '../context/ToastContext';

interface AIHealthGuidePageProps {
  onNavigate: (page: PageId) => void;
}

const QUICK_PROMPTS = [
  '🤒 I have fever and body aches',
  '💊 What is Paracetamol used for?',
  '❤️ Tips for a healthy heart',
  '🍎 Best foods for immunity',
  '😰 I feel anxious and stressed',
  '🤧 Cold and cough home remedies',
  '🩸 What causes high blood pressure?',
  '😴 How to improve sleep quality?',
];

// Simple markdown-like renderer for Gemini responses
const renderText = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold **text**
    const boldLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Bullet points
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      return (
        <li key={i} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: boldLine.replace(/^[\*\-]\s+/, '') }} />
      );
    }
    if (line.trim() === '') return <br key={i} />;
    return <p key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: boldLine }} />;
  });
};

export const AIHealthGuidePage: React.FC<AIHealthGuidePageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Init chat on mount
  useEffect(() => {
    if (isGeminiConfigured) {
      const initial = initGeminiChat();
      setMessages(initial);
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await sendMessageToGemini(text.trim());
      const aiMsg: ChatMessage = {
        role: 'model',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'AI Error',
        message: err?.message || 'Failed to get response from Gemini. Check your API key.',
      });
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: '⚠️ Sorry, I encountered an error. Please check your Gemini API key in the `.env` file and try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isLoading, showToast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleReset = () => {
    const fresh = resetGeminiChat();
    setMessages(fresh);
    setInput('');
    showToast({ type: 'info', title: 'Chat Reset', message: 'Started a new conversation.' });
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (!isGeminiConfigured) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> AI Health Guide
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Setup Required
          </h1>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <div className="space-y-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                Gemini API Key Missing
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                To enable the AI Health Chat, you need a free Gemini API key from Google AI Studio.
              </p>
              <div className="bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl p-4 space-y-1">
                <p className="text-slate-500"># Step 1: Get your free API key from:</p>
                <p className="text-blue-400">https://aistudio.google.com/apikey</p>
                <p className="text-slate-500 mt-2"># Step 2: Add to your .env file:</p>
                <p>VITE_GEMINI_API_KEY=<span className="text-yellow-300">AIzaSy_YOUR_KEY_HERE</span></p>
                <p className="text-slate-500 mt-2"># Step 3: Restart the dev server:</p>
                <p>npm run dev</p>
              </div>

              <div className="space-y-2 pt-1">
                {[
                  'Go to aistudio.google.com/apikey',
                  'Click "Create API Key"',
                  'Copy the key (starts with AIzaSy...)',
                  'Open .env file and replace PASTE_YOUR_GEMINI_KEY_HERE',
                  'Restart npm run dev',
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-xs font-black flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>

              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold transition-colors"
              >
                <Zap className="w-4 h-4" /> Get Free API Key →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Powered by Gemini AI
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Health Guide
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Chat with Gemini AI for health guidance, symptom info & wellness tips.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="success" size="sm" dot>Gemini Live</Badge>
          <button
            onClick={handleReset}
            title="Reset chat"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Emergency Banner */}
      <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <p className="text-xs text-rose-800 dark:text-rose-300 font-medium">
            <strong>Emergency?</strong> Call <strong>112</strong> immediately. This AI is for guidance only, not diagnosis.
          </p>
        </div>
        <button
          onClick={() => onNavigate('emergency')}
          className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline shrink-0"
        >
          Emergency Mode <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden" style={{ minHeight: '500px' }}>
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '520px' }}>
          {messages.length === 0 && isInitialized && (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center space-y-3">
              <div className="p-4 rounded-full bg-teal-50 dark:bg-teal-900/30">
                <MessageSquare className="w-8 h-8 text-teal-500" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Start chatting with HealthBuddy AI!
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div className={`group relative max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-sm'
                    : 'bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-tl-sm'
                }`}>
                  <div className={`prose-sm ${msg.role === 'user' ? 'text-white' : ''}`}>
                    {renderText(msg.text)}
                  </div>
                </div>

                {/* Timestamp + Copy */}
                <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  {msg.role === 'model' && (
                    <button
                      onClick={() => handleCopy(msg.text, idx)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title="Copy response"
                    >
                      {copiedIdx === idx ? <Check className="w-3 h-3 text-teal-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-3 animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 text-teal-500 animate-spin" />
                <span className="text-xs text-slate-500 dark:text-slate-400">HealthBuddy AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && !isLoading && (
          <div className="px-4 pb-2 border-t border-slate-100 dark:border-slate-700 pt-3">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wide mb-2">
              Quick Questions:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={isLoading}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:border-teal-300 dark:hover:border-teal-600 hover:text-teal-800 dark:hover:text-teal-300 transition-all font-medium disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about symptoms, medicines, health tips... (Enter to send)"
                rows={1}
                style={{ resize: 'none', minHeight: '44px', maxHeight: '120px' }}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-3 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:bg-slate-200 dark:disabled:bg-slate-700 text-white disabled:text-slate-400 dark:disabled:text-slate-500 transition-all shadow-sm disabled:cursor-not-allowed shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">
            ⚠️ HealthBuddy AI provides general guidance only — not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};
