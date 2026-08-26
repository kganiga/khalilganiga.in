'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Sparkles, HelpCircle, Loader2, Send, CornerDownLeft, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

interface AISession {
  prompt: (text: string) => Promise<string>
  promptStreaming: (text: string) => AsyncIterable<string>
  destroy: () => Promise<void>
}

interface AICapabilities {
  available: 'no' | 'readily' | 'after-download'
}

interface AILanguageModel {
  capabilities: () => Promise<AICapabilities>
  create: (options?: { systemPrompt?: string }) => Promise<AISession>
}

interface WindowAI {
  ai?: {
    languageModel?: AILanguageModel
  }
}

interface AISummarizerProps {
  rawText: string
  title: string
}

export default function AISummarizer({ rawText, title }: AISummarizerProps) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [activeTab, setActiveTab] = useState<'summary' | 'chat'>('summary')
  const [statusText, setStatusText] = useState('')
  const responseEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    async function checkAI() {
      try {
        const winAI = window as unknown as WindowAI
        const aiObj = winAI.ai || (globalThis as unknown as WindowAI).ai
        if (aiObj && aiObj.languageModel) {
          const capabilities = await aiObj.languageModel.capabilities()
          if (capabilities.available !== 'no') {
            setIsAvailable(true)
            return
          }
        }
        setIsAvailable(false)
      } catch (err) {
        console.warn('[AISummarizer] Error checking AI capabilities:', err)
        setIsAvailable(false)
      }
    }
    checkAI()
  }, [])

  useEffect(() => {
    if (response) {
      responseEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [response])

  const getAISession = async (): Promise<AISession> => {
    const winAI = window as unknown as WindowAI
    const aiObj = winAI.ai || (globalThis as unknown as WindowAI).ai
    if (!aiObj || !aiObj.languageModel) {
      throw new Error('On-device AI not available')
    }
    const session = await aiObj.languageModel.create({
      systemPrompt: `You are a helpful assistant reading the blog article titled "${title}". Help the user understand, summarize, or extract details from the article. Answer questions objectively based solely on the provided text.`,
    })
    return session
  }

  const handleAction = async (actionType: 'summary' | 'takeaways' | 'simplify') => {
    setLoading(true)
    setResponse('')
    setStatusText('Spinning up Gemini Nano...')
    let session: AISession | null = null

    try {
      session = await getAISession()
      setStatusText('Analyzing content...')

      const cleanContent = rawText.slice(0, 8000) // Truncate to stay safely within context limits
      let promptText = ''

      if (actionType === 'summary') {
        promptText = `Provide a concise 3-4 sentence summary of this article content: \n\n"""\n${cleanContent}\n"""`
      } else if (actionType === 'takeaways') {
        promptText = `Provide a bulleted list of 4 key takeaways from this article content: \n\n"""\n${cleanContent}\n"""`
      } else {
        promptText = `Explain the core concept of this article content as if I am 10 years old: \n\n"""\n${cleanContent}\n"""`
      }

      setStatusText('Generating response...')

      try {
        const stream = await session.promptStreaming(promptText)
        for await (const chunk of stream) {
          setResponse(chunk)
        }
      } catch (streamErr) {
        // Fallback to non-streaming prompt
        const res = await session.prompt(promptText)
        setResponse(res)
      }
    } catch (err) {
      console.error(err)
      const errMsg = err instanceof Error ? err.message : String(err)
      setResponse(`Error generating response: ${errMsg}.`)
    } finally {
      if (session) {
        try {
          await session.destroy()
        } catch (e) {
          // ignore session cleanup errors
        }
      }
      setLoading(false)
      setStatusText('')
    }
  }

  const handleCustomQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customPrompt.trim() || loading) return

    const query = customPrompt.trim()
    setCustomPrompt('')
    setLoading(true)
    setResponse('')
    setStatusText('Thinking...')
    let session: AISession | null = null

    try {
      session = await getAISession()
      const cleanContent = rawText.slice(0, 8000)
      const promptText = `Article Content:\n"""\n${cleanContent}\n"""\n\nQuestion: ${query}\n\nAnswer: `

      try {
        const stream = await session.promptStreaming(promptText)
        for await (const chunk of stream) {
          setResponse(chunk)
        }
      } catch (streamErr) {
        const res = await session.prompt(promptText)
        setResponse(res)
      }
    } catch (err) {
      console.error(err)
      const errMsg = err instanceof Error ? err.message : String(err)
      setResponse(`Error answering question: ${errMsg}.`)
    } finally {
      if (session) {
        try {
          await session.destroy()
        } catch (e) {
          // ignore session cleanup errors
        }
      }
      setLoading(false)
      setStatusText('')
    }
  }

  if (isAvailable === null) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 p-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
        Checking on-device AI capabilities...
      </div>
    )
  }

  return (
    <Card className="border border-gray-200 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-900/30">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Local AI Companion</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Powered on-device by Gemini Nano
            </p>
          </div>
        </div>

        {isAvailable && (
          <div className="flex rounded-md bg-gray-100 p-0.5 dark:bg-gray-800">
            <button
              onClick={() => {
                setActiveTab('summary')
                setResponse('')
              }}
              className={`rounded px-3 py-1 text-xs font-medium transition ${
                activeTab === 'summary'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Quick Insights
            </button>
            <button
              onClick={() => {
                setActiveTab('chat')
                setResponse('')
              }}
              className={`rounded px-3 py-1 text-xs font-medium transition ${
                activeTab === 'chat'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Ask Q&A
            </button>
          </div>
        )}
      </div>

      {!isAvailable ? (
        <div className="mt-4 space-y-4">
          <div className="flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-sm text-amber-900 dark:border-amber-950 dark:bg-amber-950/20 dark:text-amber-200">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-medium">On-device AI is currently disabled in your browser.</p>
              <p className="mt-1 text-xs leading-relaxed text-amber-800/90 dark:text-amber-300/80">
                You can easily enable the local Gemini Nano model to read summaries and chat with
                this article privately without sending data to servers.
              </p>
            </div>
          </div>

          <details className="group rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              <span className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-sky-500" />
                How do I enable built-in AI in Google Chrome?
              </span>
              <span className="text-xs text-gray-400 transition group-open:rotate-180">▼</span>
            </summary>
            <div className="mt-4 space-y-3.5 pl-6 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              <p>
                Ensure you are using the latest version of <strong>Google Chrome</strong> (or Chrome
                Beta/Dev/Canary) and follow these steps:
              </p>
              <ol className="list-decimal space-y-2 pl-4">
                <li>
                  Go to{' '}
                  <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-gray-900 dark:bg-gray-800 dark:text-white">
                    chrome://flags/#optimization-guide-on-device-model
                  </code>{' '}
                  and select <strong>Enabled</strong> (or{' '}
                  <strong>Enabled BypassPrefRequirement / Enabled BypassPerfRequirement</strong> if
                  visible).
                </li>
                <li>
                  Go to{' '}
                  <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-gray-900 dark:bg-gray-800 dark:text-white">
                    chrome://flags/#prompt-api-for-gemini-nano
                  </code>{' '}
                  and select <strong>Enabled</strong>.
                </li>
                <li>
                  Click <strong>Relaunch</strong> at the bottom of the page to restart Chrome.
                </li>
                <li>
                  Open{' '}
                  <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-gray-900 dark:bg-gray-800 dark:text-white">
                    chrome://components
                  </code>
                  , find <strong>Optimization Guide On Device Model</strong>, and click{' '}
                  <strong>Check for update</strong> to download the local model (requires ~1.5GB
                  space).
                </li>
                <li>Refresh this page, and the Local AI Companion will be ready to help!</li>
              </ol>
            </div>
          </details>
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {activeTab === 'summary' ? (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={loading}
                onClick={() => handleAction('summary')}
                className="rounded-full bg-white dark:bg-gray-950"
              >
                Summarize Article
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={loading}
                onClick={() => handleAction('takeaways')}
                className="rounded-full bg-white dark:bg-gray-950"
              >
                Key Takeaways
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={loading}
                onClick={() => handleAction('simplify')}
                className="rounded-full bg-white dark:bg-gray-950"
              >
                Explain Like I'm 10
              </Button>
            </div>
          ) : (
            <form onSubmit={handleCustomQuestion} className="relative flex items-center">
              <input
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                disabled={loading}
                placeholder="Ask a question about this article..."
                className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-4 pr-24 text-sm text-gray-950 shadow-sm outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:focus:border-primary-800 dark:focus:ring-primary-950"
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                {customPrompt.trim() && (
                  <span className="hidden items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 sm:flex">
                    Enter <CornerDownLeft className="h-2.5 w-2.5" />
                  </span>
                )}
                <Button
                  size="sm"
                  type="submit"
                  disabled={!customPrompt.trim() || loading}
                  className="flex h-7 w-7 items-center justify-center rounded-md p-0"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </form>
          )}

          {loading && !response && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-500" />
              {statusText}
            </div>
          )}

          {response && (
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
              <div className="prose prose-sm max-w-none whitespace-pre-line text-sm leading-relaxed text-gray-800 dark:prose-invert dark:text-gray-300">
                {response}
              </div>
              <div ref={responseEndRef} />
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
