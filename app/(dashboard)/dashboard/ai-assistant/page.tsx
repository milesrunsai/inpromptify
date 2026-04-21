"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Bot, Send, Sparkles, User } from "lucide-react";

/* ---------- types ---------- */
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

/* ---------- constants ---------- */
const SUGGESTED_PROMPTS = [
  "How can I improve my prompt engineering?",
  "What are the key AI concepts I should know?",
  "Help me prepare for an AI assessment",
];

let messageIdCounter = 0;
function nextId(): string {
  messageIdCounter += 1;
  return `msg-${messageIdCounter}-${Date.now()}`;
}

/* ---------- Typing indicator ---------- */
function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
        <Bot className="size-4 text-gray-400" />
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="size-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
          <span className="size-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
          <span className="size-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

/* ---------- component ---------- */
export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* auto-scroll */
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming, scrollToBottom]);

  /* send message */
  const sendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;

    const userMsg: Message = { id: nextId(), role: "user", content: content.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsStreaming(true);

    const assistantId = nextId();

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content.trim(),
          history: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let assistantContent = "";

      // Add empty assistant message
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((line) => line.startsWith("data: "));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              assistantContent += parsed.content;
              const currentContent = assistantContent;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: currentContent }
                    : m
                )
              );
            }
          } catch {
            // If not JSON, treat as plain text
            assistantContent += data;
            const currentContent = assistantContent;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: currentContent }
                  : m
              )
            );
          }
        }
      }

      // If we got no streamed content, set a fallback
      if (!assistantContent) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "I'm sorry, I couldn't generate a response. Please try again." }
              : m
          )
        );
      }
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== assistantId),
        {
          id: assistantId,
          role: "assistant",
          content:
            "I'm sorry, I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  /* ---------- render ---------- */
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pb-4"
      >
        {messages.length === 0 ? (
          /* Welcome state */
          <div className="flex h-full flex-col items-center justify-center px-4">
            <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-orange-500/10">
              <Sparkles className="size-8 text-orange-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              AI Assistant
            </h2>
            <p className="mt-2 max-w-md text-center text-sm text-gray-500">
              Ask me anything about AI proficiency, prompt engineering, or
              assessment preparation. I&apos;m here to help you succeed.
            </p>

            <div className="mt-8 flex flex-col gap-2 sm:flex-row">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-left text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Message list */
          <div className="mx-auto max-w-3xl space-y-4 px-4 pt-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-3",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full",
                    msg.role === "user"
                      ? "bg-orange-500/10"
                      : "bg-gray-100"
                  )}
                >
                  {msg.role === "user" ? (
                    <User className="size-4 text-orange-400" />
                  ) : (
                    <Bot className="size-4 text-gray-400" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "rounded-tr-sm bg-orange-500/10 text-orange-900"
                      : "rounded-tl-sm border border-gray-200 bg-gray-50 text-gray-700"
                  )}
                >
                  {msg.content ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <TypingIndicator />
                  )}
                </div>
              </div>
            ))}

            {/* Streaming indicator (when assistant message not yet created) */}
            {isStreaming &&
              messages.length > 0 &&
              messages[messages.length - 1].role === "user" && (
                <TypingIndicator />
              )}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-gray-200 px-4 pt-4 pb-2">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl gap-2"
        >
          <Input
            ref={inputRef}
            placeholder="Ask me anything about AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isStreaming}
            className="flex-1 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 disabled:opacity-50"
          />
          <Button
            type="submit"
            size="default"
            disabled={isStreaming || !input.trim()}
            className="bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
          >
            <Send className="size-4" />
          </Button>
        </form>
        <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-gray-400">
          AI responses are generated and may not always be accurate. Verify
          important information independently.
        </p>
      </div>
    </div>
  );
}
