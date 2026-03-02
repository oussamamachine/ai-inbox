import React from 'react'

/**
 * A three-number summary of the current inbox state shown at the top of the
 * filter bar. Keeping it separate makes it easy to swap in a proper analytics
 * widget later without touching the message list logic.
 */
export default function StatsBar({ total, unread, platformCount }) {
  return (
    <div className="flex items-center gap-6 text-sm pb-4 border-b">
      <Stat label="Total" value={total} />
      <Stat label="Unread" value={unread} valueClass="text-blue-600" />
      <Stat label="Platforms" value={platformCount} />
    </div>
  )
}

function Stat({ label, value, valueClass = 'text-gray-900' }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-600">{label}:</span>
      <span className={`font-semibold ${valueClass}`}>{value}</span>
    </div>
  )
}
