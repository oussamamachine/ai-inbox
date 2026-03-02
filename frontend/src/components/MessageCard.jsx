import React from 'react'
import PlatformIcon from './PlatformIcon'
import ReplyEditor from './ReplyEditor'
import { getPlatformBadgeColor, getStatusBadgeColor, getRelativeTime } from '../utils/formatters'

/**
 * Renders a single message card. All actions (archive, mark read, reply, etc.)
 * are delegated upward via callbacks so this component stays purely presentational.
 */
export default function MessageCard({
  message,
  editingReply,
  isSending,
  onReplyChange,
  onReplySend,
  onReplyCancel,
  onStartReply,
  onUpdateStatus,
  onRegenerateAI,
}) {
  const { _id, source, sender, subject, body, ai_summary, ai_reply, ai_priority, status, createdAt } = message

  return (
    <article className="bg-white rounded-lg shadow-sm border hover:shadow-md transition">
      <div className="p-6">
        {/* ── Card header: badges + timestamp ── */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getPlatformBadgeColor(source)}`}>
              <PlatformIcon source={source} />
              {source}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(status)}`}>
              {status}
            </span>
            {/* Only surface priority if it's actually elevated — low-priority clutter is noise */}
            {(ai_priority === 'high' || ai_priority === 'critical') && (
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                ai_priority === 'critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
              }`}>
                {ai_priority === 'critical' ? '🚨' : '⚠️'} {ai_priority.toUpperCase()}
              </span>
            )}
          </div>
          <time
            className="text-xs text-gray-500 shrink-0"
            dateTime={createdAt}
            title={new Date(createdAt).toLocaleString()}
          >
            {getRelativeTime(createdAt)}
          </time>
        </div>

        {/* ── Sender and subject ── */}
        <div className="mb-3">
          {sender && (
            <p className="text-sm text-gray-600 mb-1">
              From: <span className="font-medium">{sender}</span>
            </p>
          )}
          {subject && (
            <h3 className="text-lg font-semibold text-gray-900">{subject}</h3>
          )}
        </div>

        {/* ── Message body ── */}
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{body}</p>

        {/* ── AI summary (collapsible to avoid visual clutter) ── */}
        {ai_summary && (
          <details className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <summary className="font-semibold text-blue-900 cursor-pointer select-none">
              AI Summary
            </summary>
            <p className="mt-2 text-blue-800">{ai_summary}</p>
          </details>
        )}

        {/* ── AI suggested reply ── */}
        {ai_reply && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="font-semibold text-green-900 mb-2">Suggested Reply</p>
            {editingReply?.id === _id ? (
              <ReplyEditor
                text={editingReply.text}
                onChange={(text) => onReplyChange({ id: _id, text })}
                onSend={onReplySend}
                onCancel={onReplyCancel}
                isSending={isSending}
              />
            ) : (
              <>
                <p className="text-green-800 italic mb-3">{ai_reply}</p>
                <button
                  onClick={() => onStartReply(message)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                >
                  Review &amp; Send
                </button>
              </>
            )}
          </div>
        )}

        {/* ── Action buttons ── */}
        <div className="flex gap-2 flex-wrap">
          {status === 'unread' && (
            <ActionButton
              label="Mark Read"
              className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={() => onUpdateStatus(_id, 'read')}
            />
          )}
          {status !== 'archived' && (
            <ActionButton
              label="Archive"
              className="bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
              onClick={() => onUpdateStatus(_id, 'archived')}
            />
          )}
          <ActionButton
            label="Regenerate AI"
            className="bg-purple-200 text-purple-800 hover:bg-purple-300"
            onClick={() => onRegenerateAI(_id)}
          />
        </div>
      </div>
    </article>
  )
}

function ActionButton({ label, className, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded transition text-sm ${className}`}
    >
      {label}
    </button>
  )
}
