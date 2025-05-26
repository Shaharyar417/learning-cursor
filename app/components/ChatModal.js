"use client";
import { useEffect, useRef, useState } from "react";

export default function ChatModal({ friend, onClose, session }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    // Fetch messages
    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/messages?user1=${session.user.email}&user2=${friend.email}`);
            const data = await res.json();
            setMessages(data);
        } catch (err) {
            // handle error
        }
        setLoading(false);
    };

    // Poll for new messages every 3 seconds
    useEffect(() => {
        let interval;
        fetchMessages(); // Call once immediately
        interval = setInterval(fetchMessages, 3000); // Then poll
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [friend.email]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Send message
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setSending(true);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receiverEmail: friend.email, content: input }),
            });
            if (res.ok) {
                setInput("");
                fetchMessages();
            }
        } catch (err) { }
        setSending(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-[#242526] rounded-xl shadow-lg w-full max-w-md flex flex-col h-[70vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="font-semibold text-lg text-gray-900 dark:text-white">Chat with {friend.name}</div>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl">&times;</button>
                </div>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 dark:bg-[#18191a]">
                    {loading ? (
                        <div className="text-gray-400">Loading...</div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg._id} className={`flex ${msg.sender.email === session.user.email ? "justify-end" : "justify-start"}`}>
                                <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender.email === session.user.email ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"}`}>
                                    <div className="text-sm">{msg.content}</div>
                                    <div className="text-xs text-right opacity-60 mt-1">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
                {/* Input */}
                <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                    <input
                        className="flex-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-2 py-1"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={sending}
                    />
                    <button type="submit" className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-sm" disabled={sending}>
                        {sending ? "Sending..." : "Send"}
                    </button>
                </form>
            </div>
        </div>
    );
} 