/**
 * Returns a human-readable relative time string for a given date.
 * e.g. "just now", "5m ago", "3h ago", "2d ago"
 */
export function getRelativeTime(date) {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now - past

  const minutes = Math.floor(diffMs / 60_000)
  const hours = Math.floor(diffMs / 3_600_000)
  const days = Math.floor(diffMs / 86_400_000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return past.toLocaleDateString()
}

/**
 * Returns Tailwind color classes for a given message source/platform.
 */
export function getPlatformBadgeColor(source) {
  const colorMap = {
    gmail:     'bg-red-100 text-red-800',
    slack:     'bg-purple-100 text-purple-800',
    whatsapp:  'bg-green-100 text-green-800',
    instagram: 'bg-pink-100 text-pink-800',
    linkedin:  'bg-blue-100 text-blue-800',
    sms:       'bg-yellow-100 text-yellow-800',
    twitter:   'bg-cyan-100 text-cyan-800',
    telegram:  'bg-sky-100 text-sky-800',
    other:     'bg-gray-100 text-gray-800',
  }
  return colorMap[source] ?? colorMap.other
}

/**
 * Returns Tailwind color classes for a given message status.
 */
export function getStatusBadgeColor(status) {
  const colorMap = {
    unread:   'bg-blue-100 text-blue-800',
    read:     'bg-gray-100 text-gray-800',
    replied:  'bg-green-100 text-green-800',
    archived: 'bg-yellow-100 text-yellow-800',
  }
  return colorMap[status] ?? colorMap.read
}

/**
 * Active filter button color per platform.
 */
export function getFilterActiveColor(source) {
  const colorMap = {
    gmail:     'bg-red-600 text-white',
    slack:     'bg-purple-600 text-white',
    whatsapp:  'bg-green-600 text-white',
    instagram: 'bg-pink-600 text-white',
    linkedin:  'bg-blue-600 text-white',
    sms:       'bg-yellow-600 text-white',
    twitter:   'bg-cyan-600 text-white',
    telegram:  'bg-sky-600 text-white',
  }
  return colorMap[source] ?? 'bg-blue-600 text-white'
}
