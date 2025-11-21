import { useState, useEffect, useCallback } from 'react'
import StorageService from '@/lib/storage.service'

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return StorageService.getItem(key, initialValue)
    } catch (error) {
      console.error('Error reading from storage:', error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      StorageService.setItem(key, valueToStore)
    } catch (error) {
      console.error('Error writing to storage:', error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}

export default useLocalStorage
