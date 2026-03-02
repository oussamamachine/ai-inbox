import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useMessages } from '../hooks/useMessages'
import MessageCard from '../components/MessageCard'
import FilterBar from '../components/FilterBar'
import SearchBar from '../components/SearchBar'
import StatsBar from '../components/StatsBar'

export default function Dashboard() {
  const { user, logout } = useAuth()

  const [sourceFilter, setSourceFilter] = useState('')
  const [searchQuery, setSearchQuery]   = useState('')
  const [success, setSuccess]           = useState('')
  const [editingReply, setEditingReply] = useState(null) // { id, text }
  const [isSending, setIsSending]       = useState(false)

  const { messages, loading, error, setError, updateStatus, regenerateAI, sendReply } =
    useMessages(sourceFilter)

  // Dismiss the success banner automatically after 3 seconds
  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => setSuccess(''), 3000)
    return () => clearTimeout(timer)
  }, [success])

  // Client-side search runs over the already-filtered list returned by the API
  const visibleMessages = useMemo(() => {
    if (!searchQuery) return messages
    const q = searchQuery.toLowerCase()
    return messages.filter(
      (m) =>
        m.sender?.toLowerCase().includes(q) ||
        m.subject?.toLowerCase().includes(q) ||
        m.body?.toLowerCase().includes(q)
    )
  }, [messages, searchQuery])

  const stats = useMemo(() => ({
    total:         messages.length,
    unread:        messages.filter((m) => m.status === 'unread').length,
    platformCount: new Set(messages.map((m) => m.source)).size,
  }), [messages])

  const platformCounts = useMemo(() =>
    messages.reduce((acc, m) => {
      acc[m.source] = (acc[m.source] ?? 0) + 1
      return acc
    }, {}),
  [messages])

  function handleStartReply(message) {
    setEditingReply({ id: message._id, text: message.ai_reply ?? '' })
  }

  async function handleSendReply() {
    if (!editingReply?.text.trim()) return
    setIsSending(true)
    try {
      const successMsg = await sendReply(editingReply.id, editingReply.text)
      setSuccess(successMsg)
      setEditingReply(null)
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Failed to send reply')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── App Header ── */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">AI Smart Inbox</h1>
              <p className="text-blue-100 mt-1 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Welcome back, <span className="font-semibold">{user?.name ?? user?.email?.split('@')[0]}</span>
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 font-medium border border-white/20 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* ── Filter / Search Bar ── */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 space-y-4">
          <StatsBar
            total={stats.total}
            unread={stats.unread}
            platformCount={stats.platformCount}
          />
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <FilterBar
            activeFilter={sourceFilter}
            platformCounts={platformCounts}
            onFilterChange={setSourceFilter}
          />
        </div>
      </div>

      {/* ── Message List ── */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Error banner */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700" aria-label="Dismiss">✕</button>
          </div>
        )}

        {/* Success banner */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </span>
            <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-700" aria-label="Dismiss">✕</button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <p className="mt-2 text-gray-600">Loading messages...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && visibleMessages.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="mt-4 text-gray-500 text-lg font-medium">
              {searchQuery
                ? 'No messages match your search'
                : sourceFilter
                ? `No ${sourceFilter} messages yet`
                : 'No messages yet'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {searchQuery
                ? 'Try different keywords'
                : 'Connect your accounts via n8n to start receiving messages'}
            </p>
          </div>
        )}

        {/* Message cards */}
        {!loading && visibleMessages.length > 0 && (
          <div className="space-y-4">
            {visibleMessages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                editingReply={editingReply}
                isSending={isSending}
                onStartReply={handleStartReply}
                onReplyChange={setEditingReply}
                onReplySend={handleSendReply}
                onReplyCancel={() => setEditingReply(null)}
                onUpdateStatus={updateStatus}
                onRegenerateAI={regenerateAI}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

