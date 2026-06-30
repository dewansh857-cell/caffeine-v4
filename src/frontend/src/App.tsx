import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Bot,
  Loader2,
  MessageSquarePlus,
  Send,
  SquarePen,
  Trash2,
  User,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

const STORAGE_KEY = "caffeine-chat-sessions";
const SYSTEM_PROMPT =
  "You are an expert app development assistant. Help users design, plan, and build web and mobile applications. Provide clear, actionable advice on architecture, UI/UX, tech stacks, and implementation steps. Be concise but thorough.";

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return [];
}

function saveSessions(sessions: ChatSession[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    /* ignore */
  }
}

function createSession(title = "New Chat"): ChatSession {
  return {
    id: generateId(),
    title,
    messages: [],
    updatedAt: Date.now(),
  };
}

async function streamChat(
  messages: { role: string; content: string }[],
  onChunk: (chunk: string) => void,
  signal: AbortSignal,
) {
  const res = await fetch(
    "https://text.pollinations.ai/openai/chat/completions",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai",
        messages,
        stream: true,
      }),
      signal,
    },
  );

  if (!res.ok || !res.body) {
    throw new Error(`HTTP ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (data === "[DONE]") return;
      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) onChunk(delta);
      } catch {
        /* ignore malformed SSE */
      }
    }
  }
}

function Sidebar({
  sessions,
  activeId,
  onNewChat,
  onSelect,
  onDelete,
}: {
  sessions: ChatSession[];
  activeId: string | null;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <aside
      className="flex h-full w-64 flex-col border-r"
      style={{
        backgroundColor: "var(--sidebar-bg)",
        borderColor: "var(--sidebar-border)",
      }}
    >
      <div className="flex items-center gap-2 p-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent)] text-[var(--accent-fg)]">
          <Bot className="h-4 w-4" />
        </div>
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--sidebar-fg)" }}
        >
          Caffeine Chat
        </span>
      </div>

      <div className="px-3 pb-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-[var(--sidebar-border)] bg-transparent text-[var(--sidebar-fg)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-fg)]"
          onClick={onNewChat}
          data-ocid="chat.new_chat_button"
        >
          <MessageSquarePlus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-1 no-scrollbar">
        {sessions.length === 0 && (
          <div
            className="px-2 py-6 text-center text-xs"
            style={{ color: "var(--sidebar-muted)" }}
          >
            No chats yet. Start a new conversation!
          </div>
        )}
        {sessions.map((session) => {
          const isActive = session.id === activeId;
          return (
            <button
              key={session.id}
              type="button"
              className={cn(
                "group mb-1 flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-left transition-fast",
                isActive
                  ? "bg-[var(--sidebar-active)] text-[var(--sidebar-fg)]"
                  : "text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-fg)]",
              )}
              onClick={() => onSelect(session.id)}
              data-ocid={`chat.session.item.${session.id}`}
            >
              <SquarePen className="h-3.5 w-3.5 flex-shrink-0 opacity-60" />
              <span className="flex-1 truncate">{session.title}</span>
              <button
                type="button"
                className="flex h-6 w-6 items-center justify-center rounded opacity-0 transition-fast group-hover:opacity-100 hover:bg-[var(--sidebar-active)]"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(session.id);
                }}
                aria-label="Delete chat"
                data-ocid={`chat.session.delete_button.${session.id}`}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </button>
          );
        })}
      </div>

      <div
        className="border-t px-3 py-2 text-xs"
        style={{
          borderColor: "var(--sidebar-border)",
          color: "var(--sidebar-muted)",
        }}
      >
        &copy; {new Date().getFullYear()}. Built with love using{" "}
        <a
          href="https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=chat"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[var(--sidebar-fg)]"
        >
          caffeine.ai
        </a>
      </div>
    </aside>
  );
}

function ChatArea({
  session,
  onSend,
  isLoading,
}: {
  session: ChatSession | null;
  onSend: (text: string) => void;
  isLoading: boolean;
}) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const msgCount = session?.messages.length ?? 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message count or loading change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgCount, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div
      className="flex h-full flex-col"
      style={{ backgroundColor: "var(--chat-bg)" }}
    >
      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 no-scrollbar"
      >
        {!session || session.messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <Bot className="h-6 w-6 text-[var(--accent-fg)]" />
            </div>
            <div>
              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--chat-fg)" }}
              >
                What app would you like to build?
              </h2>
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--chat-muted)" }}
              >
                Describe your idea and I will help you design, plan, and build
                it.
              </p>
            </div>
            <div className="flex max-w-md flex-wrap justify-center gap-2">
              {[
                "I want a task manager for remote teams",
                "Build me a personal finance tracker",
                "Design a community forum app",
                "Create a booking system for salons",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="rounded-full border px-3 py-1.5 text-xs transition-fast hover:bg-[var(--user-bubble-bg)]"
                  style={{
                    borderColor: "var(--chat-border)",
                    color: "var(--chat-muted)",
                  }}
                  onClick={() => onSend(suggestion)}
                  data-ocid="chat.suggestion_button"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-5">
            {session.messages.map((msg, idx) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
                data-ocid={`chat.message.item.${idx + 1}`}
              >
                <div
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor:
                      msg.role === "user"
                        ? "var(--accent)"
                        : "var(--assistant-bubble-bg)",
                    color:
                      msg.role === "user"
                        ? "var(--accent-fg)"
                        : "var(--assistant-bubble-fg)",
                    border:
                      msg.role === "assistant"
                        ? "1px solid var(--chat-border)"
                        : "none",
                  }}
                >
                  {msg.role === "user" ? (
                    <User className="h-3.5 w-3.5" />
                  ) : (
                    <Bot className="h-3.5 w-3.5" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user" ? "rounded-br-md" : "rounded-bl-md",
                  )}
                  style={{
                    backgroundColor:
                      msg.role === "user"
                        ? "var(--user-bubble-bg)"
                        : "var(--assistant-bubble-bg)",
                    color:
                      msg.role === "user"
                        ? "var(--user-bubble-fg)"
                        : "var(--assistant-bubble-fg)",
                    border:
                      msg.role === "assistant"
                        ? "1px solid var(--chat-border)"
                        : "1px solid transparent",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3" data-ocid="chat.loading_state">
                <div
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border"
                  style={{
                    backgroundColor: "var(--assistant-bubble-bg)",
                    borderColor: "var(--chat-border)",
                  }}
                >
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div
                  className="flex items-center gap-1 rounded-2xl rounded-bl-md border px-4 py-3 text-sm"
                  style={{
                    backgroundColor: "var(--assistant-bubble-bg)",
                    borderColor: "var(--chat-border)",
                    color: "var(--chat-muted)",
                  }}
                >
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className="border-t px-4 py-3"
        style={{ borderColor: "var(--chat-border)" }}
      >
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-center gap-2 rounded-full border px-3 py-1"
          style={{
            backgroundColor: "var(--input-bg)",
            borderColor: "var(--input-border)",
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the app you want to build..."
            className="flex-1 border-0 bg-transparent px-2 py-2 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            style={{ color: "var(--chat-fg)" }}
            data-ocid="chat.input"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="h-8 w-8 rounded-full"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--accent-fg)",
            }}
            data-ocid="chat.send_button"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
        <p
          className="mt-1.5 text-center text-[10px]"
          style={{ color: "var(--chat-muted)" }}
        >
          AI responses are generated by Pollinations.ai. Verify critical details
          before building.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const activeSession = sessions.find((s) => s.id === activeId) ?? null;

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  const handleNewChat = useCallback(() => {
    const session = createSession();
    setSessions((prev) => [session, ...prev]);
    setActiveId(session.id);
  }, []);

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      setSessions((prev) => {
        const next = prev.filter((s) => s.id !== id);
        if (activeId === id) {
          setActiveId(next[0]?.id ?? null);
        }
        return next;
      });
    },
    [activeId],
  );

  const handleSend = useCallback(
    async (text: string) => {
      let sessionId = activeId;
      let currentSession = sessions.find((s) => s.id === sessionId);

      // If no active session, create one
      if (!currentSession) {
        const newSession = createSession(text.slice(0, 30));
        sessionId = newSession.id;
        setSessions((prev) => [newSession, ...prev]);
        setActiveId(sessionId);
        currentSession = newSession;
      }

      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        text,
        timestamp: Date.now(),
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                messages: [...s.messages, userMsg],
                updatedAt: Date.now(),
                title: s.title === "New Chat" ? text.slice(0, 30) : s.title,
              }
            : s,
        ),
      );

      setIsLoading(true);
      const assistantId = generateId();
      const abortController = new AbortController();
      abortRef.current = abortController;

      try {
        const history = currentSession.messages.map((m) => ({
          role: m.role,
          content: m.text,
        }));

        await streamChat(
          [
            { role: "system", content: SYSTEM_PROMPT },
            ...history,
            { role: "user", content: text },
          ],
          (chunk) => {
            setSessions((prev) =>
              prev.map((s) => {
                if (s.id !== sessionId) return s;
                const last = s.messages[s.messages.length - 1];
                if (
                  last &&
                  last.role === "assistant" &&
                  last.id === assistantId
                ) {
                  return {
                    ...s,
                    messages: s.messages.with(-1, {
                      ...last,
                      text: last.text + chunk,
                    }),
                    updatedAt: Date.now(),
                  };
                }
                return {
                  ...s,
                  messages: [
                    ...s.messages,
                    {
                      id: assistantId,
                      role: "assistant",
                      text: chunk,
                      timestamp: Date.now(),
                    },
                  ],
                  updatedAt: Date.now(),
                };
              }),
            );
          },
          abortController.signal,
        );
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setSessions((prev) =>
            prev.map((s) =>
              s.id === sessionId
                ? {
                    ...s,
                    messages: [
                      ...s.messages,
                      {
                        id: generateId(),
                        role: "assistant",
                        text: "Sorry, I encountered an error. Please try again.",
                        timestamp: Date.now(),
                      },
                    ],
                    updatedAt: Date.now(),
                  }
                : s,
            ),
          );
        }
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [activeId, sessions],
  );

  // Create initial session if none exist
  useEffect(() => {
    if (sessions.length === 0) {
      const session = createSession();
      setSessions([session]);
      setActiveId(session.id);
    }
  }, [sessions.length]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onNewChat={handleNewChat}
        onSelect={handleSelect}
        onDelete={handleDelete}
      />
      <main className="flex-1">
        <ChatArea
          session={activeSession}
          onSend={handleSend}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
async function streamChat(
  messages: { role: string; content: string }[],
  onChunk: (chunk: string) => void,
  signal: AbortSignal,
) {
  throw new Error(
    "No AI provider configured. Please configure Sarvam AI in Settings."
  );
}
