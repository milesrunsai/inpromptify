"use client";

import { useState, useEffect } from "react";
import { MessageSquare, User, Bot, Expand, Compress, Terminal } from "lucide-react";

interface AiConversation {
  id: string;
  userId: string;
  userEmail: string;
  userName: string | null;
  role: string; // 'user' | 'assistant'
  content: string;
  createdAt: string;
}

export default function AdminConversationsPage() {
  const [conversations, setConversations] = useState<AiConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"card" | "terminal">("card");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // This would fetch from your API endpoint
        const response = await fetch(`/api/admin/conversations?secret=flinch-admin-2026-xyz`);
        if (response.ok) {
          const data = await response.json();
          setConversations(data.conversations || []);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Group conversations by user and session
  const groupedConversations = conversations.reduce((acc, conv) => {
    const key = `${conv.userId}-${conv.createdAt.slice(0, 10)}`; // Group by user and date
    if (!acc[key]) {
      acc[key] = {
        userEmail: conv.userEmail,
        userName: conv.userName,
        date: conv.createdAt,
        messages: [],
      };
    }
    acc[key].messages.push(conv);
    return acc;
  }, {} as Record<string, any>);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            AI Conversations Log
          </h1>
          <p className="text-gray-600 mt-1">Loading conversations...</p>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-6 bg-white animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            AI Conversations Log
          </h1>
          <p className="text-gray-600 mt-1">
            Review AI chat interactions and conversations
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("card")}
            className={`px-3 py-1 rounded-md text-sm ${
              viewMode === "card"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Card View
          </button>
          <button
            onClick={() => setViewMode("terminal")}
            className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
              viewMode === "terminal"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Terminal className="size-3" />
            Terminal
          </button>
        </div>
      </div>

      {/* No Data State */}
      {Object.keys(groupedConversations).length === 0 ? (
        <div className="border border-gray-200 rounded-xl bg-white p-12 text-center">
          <MessageSquare className="size-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No AI Conversations Yet
          </h3>
          <p className="text-gray-600 mb-4">
            AI chat logs will appear here once logging is added to the chat endpoint.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left max-w-md mx-auto">
            <p className="text-sm font-medium text-gray-900 mb-2">To enable logging:</p>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Add logging to your AI chat API endpoint</li>
              <li>Store messages in the AiChatMessage table</li>
              <li>Include both user prompts and assistant responses</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedConversations).map(([key, session]) => (
            <div key={key} className="border border-gray-200 rounded-xl bg-white overflow-hidden">
              <div 
                className="p-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                onClick={() => toggleExpanded(key)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="size-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {session.userName || "Anonymous"}
                      </div>
                      <div className="text-sm text-gray-600">{session.userEmail}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-600">
                      {new Date(session.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="text-sm text-gray-500">
                      {session.messages.length} messages
                    </div>
                    {expandedId === key ? (
                      <Compress className="size-4 text-gray-400" />
                    ) : (
                      <Expand className="size-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {expandedId === key && (
                <div className="p-4">
                  {viewMode === "terminal" ? (
                    // Terminal View
                    <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                      {session.messages.map((msg: AiConversation, idx: number) => (
                        <div key={msg.id} className="mb-3">
                          <div className={`text-xs mb-1 ${
                            msg.role === "user" ? "text-green-400" : "text-blue-400"
                          }`}>
                            [{new Date(msg.createdAt).toLocaleTimeString()}] {
                              msg.role === "user" ? "USER" : "ASSISTANT"
                            }:
                          </div>
                          <div className="text-gray-100 whitespace-pre-wrap pl-4 border-l-2 border-gray-700">
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Card View
                    <div className="space-y-3">
                      {session.messages.map((msg: AiConversation) => (
                        <div key={msg.id} className="flex gap-3">
                          <div className="shrink-0">
                            {msg.role === "user" ? (
                              <User className="size-6 text-blue-600" />
                            ) : (
                              <Bot className="size-6 text-orange-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                {msg.role === "user" ? "User" : "Assistant"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(msg.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">
                              {msg.content.length > 500 
                                ? `${msg.content.slice(0, 500)}...` 
                                : msg.content}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}