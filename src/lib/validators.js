// Email Validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password Validation
export const isValidPassword = (password) => {
  return password.length >= 8
}

export const getPasswordStrength = (password) => {
  let strength = 0
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  if (strength < 2) return 'weak'
  if (strength < 4) return 'fair'
  if (strength < 6) return 'good'
  return 'strong'
}

// URL Validation
export const isValidURL = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Phone Validation
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Course Code Validation
export const isValidCourseCode = (code) => {
  return /^[A-Z0-9]{3,10}$/.test(code)
}

// Non-empty String
export const isNonEmptyString = (str) => {
  return typeof str === 'string' && str.trim().length > 0
}

// Positive Number
export const isPositiveNumber = (num) => {
  return !isNaN(num) && Number(num) > 0
}

// Array Not Empty
export const isNonEmptyArray = (arr) => {
  return Array.isArray(arr) && arr.length > 0
}

// Object Validation
export const isNonEmptyObject = (obj) => {
  return obj && Object.keys(obj).length > 0
}
