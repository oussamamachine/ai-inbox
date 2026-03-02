import React from 'react'
import PlatformIcon from './PlatformIcon'
import { getFilterActiveColor } from '../utils/formatters'

const PLATFORMS = [
  'gmail', 'slack', 'whatsapp', 'instagram',
  'linkedin', 'sms', 'twitter', 'telegram',
]

/**
 * Horizontal scrollable row of filter pills for narrowing messages by platform.
 * The "All" pill resets the filter; individual platform pills set it.
 */
export default function FilterBar({ activeFilter, platformCounts, onFilterChange }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <FilterButton
        label="All"
        count={Object.values(platformCounts).reduce((sum, n) => sum + n, 0)}
        isActive={activeFilter === ''}
        activeClass="bg-blue-600 text-white"
        onClick={() => onFilterChange('')}
      />
      {PLATFORMS.map((platform) => (
        <FilterButton
          key={platform}
          label={platform === 'twitter' ? 'X' : platform.charAt(0).toUpperCase() + platform.slice(1)}
          count={platformCounts[platform] ?? 0}
          isActive={activeFilter === platform}
          activeClass={getFilterActiveColor(platform)}
          icon={<PlatformIcon source={platform} />}
          onClick={() => onFilterChange(platform)}
        />
      ))}
    </div>
  )
}

function FilterButton({ label, count, isActive, activeClass, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
        isActive ? activeClass : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {icon}
      <span>{label}</span>
      <span className="ml-1 text-xs opacity-75">({count})</span>
    </button>
  )
}
