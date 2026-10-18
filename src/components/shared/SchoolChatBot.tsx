
"use client";

import {
  Bot,
  LoaderCircle,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatResponse = {
  reply?: string;
  error?: string;
};

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hello! Welcome to Albert Academy. Ask me about our history, notable alumni, academic information, school leadership, or published school facts.",
};

export function SchoolChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    INITIAL_MESSAGE,
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading, isOpen]);

  useEffect(() => {
    if (isOpen && !loading) {
      inputRef.current?.focus();
    }
  }, [isOpen, loading]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const question = input.trim();

    if (!question || loading || question.length > 1200) {
      return;
    }

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: question },
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.slice(-8),
        }),
      });

      const result = (await response.json()) as ChatResponse;

      if (
        !response.ok ||
        typeof result.reply !== "string" ||
        !result.reply.trim()
      ) {
        throw new Error(
          result.error || "Unable to get a response.",
        );
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: result.reply!,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I'm sorry, I couldn't retrieve an answer just now. Please try again shortly or explore the information on our website.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <section
          aria-label="Albert Academy chat assistant"
          aria-busy={loading}
          className="mb-3 flex h-[min(34rem,calc(100dvh-7rem))] w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:w-[380px]"
        >
          <header className="flex items-center justify-between gap-3 bg-[#7A1523] px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-white/15">
                <Bot aria-hidden="true" size={22} />
              </div>

              <div>
                <h2 className="font-semibold">
                  Albert Academy
                </h2>
                <p className="text-xs text-white/80">
                  School information assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <X aria-hidden="true" size={20} />
            </button>
          </header>

          <div
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            aria-label="Chat messages"
            className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4"
          >
            {messages.map((message, index) => (
              <div
                key={`${index}-${message.role}`}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-br-md bg-[#7A1523] text-white"
                      : "rounded-bl-md border border-gray-200 bg-white text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
                  <LoaderCircle
                    aria-hidden="true"
                    className="animate-spin"
                    size={16}
                  />
                  Finding an answer…
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-200 bg-white p-3"
          >
            <div className="flex items-end gap-2">
              <label
                className="sr-only"
                htmlFor="school-chat-message"
              >
                Ask Albert Academy a question
              </label>

              <textarea
                ref={inputRef}
                id="school-chat-message"
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Ask a question…"
                maxLength={1200}
                rows={1}
                disabled={loading}
                className="max-h-28 min-h-11 flex-1 resize-y rounded-xl border border-gray-300 px-3 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#7A1523] focus:ring-1 focus:ring-[#7A1523] disabled:bg-gray-100"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#7A1523] text-white transition hover:bg-[#5e101b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A1523] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <LoaderCircle
                    aria-hidden="true"
                    className="animate-spin"
                    size={18}
                  />
                ) : (
                  <Send aria-hidden="true" size={18} />
                )}
              </button>
            </div>

            <p className="mt-2 text-center text-[11px] text-gray-500">
              Answers are based on available school information.
            </p>
          </form>
        </section>
      )}

      <button
        type="button"
        aria-label={
          isOpen
            ? "Close school chat"
            : "Chat with Albert Academy"
        }
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="ml-auto flex size-14 items-center justify-center rounded-full bg-[#7A1523] text-white shadow-lg transition hover:scale-105 hover:bg-[#5e101b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A1523]"
      >
        {isOpen ? (
          <X aria-hidden="true" size={24} />
        ) : (
          <MessageCircle aria-hidden="true" size={25} />
        )}
      </button>
    </div>
  );
}
