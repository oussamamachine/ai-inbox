import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

/**
 * Centralises all message-related state and API calls.
 *
 * Keeping this logic out of Dashboard.jsx means the component can focus purely
 * on layout and presentation, and the same hook can be reused if we ever add a
 * mobile view or a separate archived-messages page.
 */
export function useMessages(sourceFilter) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const query = sourceFilter ? `?source=${sourceFilter}` : ''
      const { data } = await api.get(`/messages${query}`)
      // Guard against unexpected API shapes
      setMessages(Array.isArray(data?.data) ? data.data : [])
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Failed to load messages. Is the server running?')
      setMessages([])
    } finally {
      setLoading(false)
    }
  }, [sourceFilter])

  // Reload whenever the active filter changes
  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const updateStatus = useCallback(async (messageId, newStatus) => {
    try {
      await api.patch(`/messages/${messageId}`, { status: newStatus })
      // Optimistic-style update: refresh the list rather than mutating local state
      // so the user always sees server-authoritative data
      fetchMessages()
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Failed to update message')
    }
  }, [fetchMessages])

  const regenerateAI = useCallback(async (messageId) => {
    try {
      await api.post(`/messages/${messageId}/regenerate`)
      fetchMessages()
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Failed to regenerate AI content')
    }
  }, [fetchMessages])

  const sendReply = useCallback(async (messageId, replyText) => {
    const { data } = await api.post(`/messages/${messageId}/reply`, { replyText })
    fetchMessages()
    return data.message ?? 'Reply sent successfully'
  }, [fetchMessages])

  return {
    messages,
    loading,
    error,
    setError,
    refetch: fetchMessages,
    updateStatus,
    regenerateAI,
    sendReply,
  }
}
