// Number Formatting
export const formatNumber = (num, decimals = 0) => {
  return Number(num).toFixed(decimals)
}

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

export const abbreviateNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

// String Formatting
export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const formatTitleCase = (str) => {
  return str
    .split(' ')
    .map(word => capitalizeFirst(word))
    .join(' ')
}

export const truncateString = (str, maxLength = 50, suffix = '...') => {
  if (str.length <= maxLength) return str
  return str.substring(0, maxLength - suffix.length) + suffix
}

// Time Formatting
export const formatDuration = (seconds) => {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`
  }
  return `${secs}s`
}

export const formatTimestamp = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return new Date(date).toLocaleDateString()
}

export const formatDate = (date, format = 'MMM DD, YYYY') => {
  const d = new Date(date)
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  return d.toLocaleDateString('en-US', options)
}

// Percentage
export const formatPercentage = (value, total, decimals = 0) => {
  if (total === 0) return '0%'
  return ((value / total) * 100).toFixed(decimals) + '%'
}

export const getPercentageColor = (percentage) => {
  if (percentage >= 80) return '#10b981'
  if (percentage >= 60) return '#f59e0b'
  if (percentage >= 40) return '#f97316'
  return '#ef4444'
}
