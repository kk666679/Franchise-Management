"use client"

import type { UIMessage } from "ai"
import { generateId } from "ai"
import { CopyIcon, SparklesIcon } from "lucide-react"
import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input"
import { Shimmer } from "@/components/ai-elements/shimmer"
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion"
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool"

const SUGGESTIONS = [
  "Summarise outstanding royalty payments this month",
  "Which franchisees have agreements expiring in 90 days?",
  "Show compliance scores across all active branches",
  "Draft a renewal notice for agreement AGR-2024-001",
]

type ChatStatus = "idle" | "submitted" | "streaming" | "error"

function MessageParts({ message }: { message: UIMessage }) {
  return (
    <>
      {message.parts.map((part, i) => {
        const key = `${message.id}-${i}`

        if (part.type === "text") {
          return (
            <Message key={key} from={message.role}>
              <MessageContent>
                <MessageResponse>{part.text}</MessageResponse>
              </MessageContent>
              {message.role === "assistant" && (
                <MessageActions>
                  <MessageAction
                    tooltip="Copy"
                    onClick={() => navigator.clipboard.writeText(part.text)}
                  >
                    <CopyIcon />
                  </MessageAction>
                </MessageActions>
              )}
            </Message>
          )
        }

        if (part.type.startsWith("tool-")) {
          const toolName =
            "toolName" in part
              ? String((part as { toolName: unknown }).toolName)
              : part.type
          const rawState =
            "state" in part ? String((part as { state: unknown }).state) : ""
          const state =
            rawState === "result"
              ? ("output-available" as const)
              : rawState === "call"
                ? ("input-available" as const)
                : ("input-streaming" as const)
          const args = "args" in part ? (part as { args: unknown }).args : {}
          const result =
            "result" in part ? (part as { result: unknown }).result : undefined
          return (
            <Tool key={key}>
              <ToolHeader
                type="dynamic-tool"
                state={state}
                toolName={toolName}
              />
              <ToolContent>
                <ToolInput input={args} />
                {result !== undefined && (
                  <ToolOutput output={result} errorText={undefined} />
                )}
              </ToolContent>
            </Tool>
          )
        }

        return null
      })}
    </>
  )
}

function AIChat() {
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [input, setInput] = useState("")
  const [status, setStatus] = useState<ChatStatus>("idle")
  const abortRef = useRef<AbortController | null>(null)
  const searchParams = useSearchParams()
  const suggestedPrompt = searchParams.get("prompt")

  const isEmpty = messages.length === 0

  useEffect(() => {
    if (suggestedPrompt) setInput(suggestedPrompt)
  }, [suggestedPrompt])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || status === "submitted" || status === "streaming")
        return

      const userMsg: UIMessage = {
        id: generateId(),
        role: "user",
        parts: [{ type: "text", text }],
      }

      setMessages((prev) => [...prev, userMsg])
      setInput("")
      setStatus("submitted")

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [...messages, userMsg] }),
          signal: controller.signal,
        })

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const assistantId = generateId()
        let accumulated = ""
        setStatus("streaming")

        const assistantMsg: UIMessage = {
          id: assistantId,
          role: "assistant",
          parts: [{ type: "text", text: "" }],
        }
        setMessages((prev) => [...prev, assistantMsg])

        const reader = res.body?.getReader()
        const decoder = new TextDecoder()

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            accumulated += decoder.decode(value, { stream: true })
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      content: accumulated,
                      parts: [{ type: "text", text: accumulated }],
                    }
                  : m
              )
            )
          }

        }

        setStatus("idle")
      } catch (err) {
        if ((err as Error).name !== "AbortError") setStatus("error")
        else setStatus("idle")
      }
    },
    [messages, status]
  )

  const stop = useCallback(() => {
    abortRef.current?.abort()
    setStatus("idle")
  }, [])

  return (
    <div className="flex h-[calc(100svh-4rem)] flex-col">
      <Conversation className="flex-1">
        <ConversationContent>
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
              <div className="flex size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <SparklesIcon className="size-8" />
              </div>
              <div className="space-y-2">
                <Shimmer className="text-2xl font-semibold" duration={3}>
                  Franchise Intelligence
                </Shimmer>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Ask anything about your franchise network — royalties,
                  compliance, agreements, performance.
                </p>
              </div>
              <Suggestions>
                {SUGGESTIONS.map((s) => (
                  <Suggestion key={s} suggestion={s} onClick={setInput} />
                ))}
              </Suggestions>
            </div>
          ) : (
            messages.map((message) => (
              <MessageParts key={message.id} message={message} />
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border/60 bg-background/80 px-4 py-4 backdrop-blur-sm">
        {!isEmpty && (
          <Suggestions className="mb-3">
            {SUGGESTIONS.slice(0, 2).map((s) => (
              <Suggestion key={s} suggestion={s} onClick={setInput} />
            ))}
          </Suggestions>
        )}
        <PromptInput
          onSubmit={() => sendMessage(input)}
          className="mx-auto max-w-3xl"
        >
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your franchise network…"
          />
          <PromptInputFooter>
            <span className="text-xs text-muted-foreground">
              AI responses may be inaccurate. Verify before acting.
            </span>
            <PromptInputSubmit
              status={
                status === "submitted"
                  ? "submitted"
                  : status === "streaming"
                    ? "streaming"
                    : status === "error"
                      ? "error"
                      : undefined
              }
              onStop={stop}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  )
}

export default function AIPage() {
  return (
    <Suspense fallback={<div className="min-h-40" aria-busy="true" />}>
      <AIChat />
    </Suspense>
  )
}
