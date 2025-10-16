import React, { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { chatApi } from '@/services/api'

const Chatbot: React.FC = () => {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<{ from: 'bot' | 'me'; text: string }[]>([
        { from: 'bot', text: 'Hi! How can I help you today? You can ask about payments, EMIs, or card issues.' }
    ])
    const [draft, setDraft] = useState('')
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // Create chat session when chatbot opens
    useEffect(() => {
        if (open && !sessionId) {
            chatApi.createSession('Support Chat', 'gemini-1.5-flash')
                .then(session => setSessionId(session._id || session.id))
                .catch(err => console.error('Failed to create chat session:', err));
        }
    }, [open, sessionId]);

    const send = async () => {
        const text = draft.trim()
        if (!text || !sessionId) return

        setMessages((m) => [...m, { from: 'me', text }])
        setDraft('')
        setLoading(true)

        try {
            const response = await chatApi.sendMessage(sessionId, text);
            setMessages((m) => [...m, { from: 'bot', text: response.reply || 'I received your message!' }])
        } catch (err) {
            console.error('Chat error:', err);
            setMessages((m) => [...m, { from: 'bot', text: 'Sorry, I encountered an error. Please try again or visit the Support page.' }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {!open && (
                <button aria-label="Open support chat" onClick={() => setOpen(true)} className="p-4 rounded-full bg-yellow-400 text-black shadow-lg hover:scale-105 transition">
                    <MessageCircle size={20} />
                </button>
            )}
            {open && (
                <div className="w-80 h-96 rounded-2xl bg-gray-900/95 border border-gray-800 shadow-2xl flex flex-col">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
                        <div className="text-sm font-semibold">Support Assistant</div>
                        <button aria-label="Close chat" onClick={() => setOpen(false)} className="p-1 rounded hover:bg-gray-800"><X size={16} /></button>
                    </div>
                    <div className="flex-1 overflow-auto p-3 space-y-2">
                        {messages.map((m, i) => (
                            <div key={i} className={`max-w-[80%] px-3 py-2 rounded-xl ${m.from === 'me' ? 'ml-auto bg-yellow-400 text-black' : 'bg-gray-800 text-white'}`}>{m.text}</div>
                        ))}
                    </div>
                    <div className="p-2 border-t border-gray-800 flex items-center gap-2">
                        <input
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !loading && send()}
                            placeholder="Type a message..."
                            className="flex-1 bg-gray-800 p-2 rounded-md text-sm border border-gray-700"
                            disabled={loading}
                        />
                        <button
                            onClick={send}
                            disabled={loading}
                            className="px-3 py-2 rounded-md bg-yellow-400 text-black text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Chatbot

