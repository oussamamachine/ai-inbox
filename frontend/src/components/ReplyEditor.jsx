import React from 'react'

/**
 * Inline reply editor that appears inside a message card when the user clicks
 * "Review & Send". The AI-suggested text is pre-populated but fully editable
 * before dispatching to the platform API.
 */
export default function ReplyEditor({ text, onChange, onSend, onCancel, isSending }) {
  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-y"
        rows={4}
        placeholder="Edit your reply..."
      />
      <div className="flex gap-2">
        <button
          onClick={onSend}
          disabled={isSending || !text.trim()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSending ? (
            <>
              <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            'Send Reply'
          )}
        </button>
        <button
          onClick={onCancel}
          disabled={isSending}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
