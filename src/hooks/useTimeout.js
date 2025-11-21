import { useCallback, useState, useRef, useEffect } from 'react'

export const useTimeout = (callback, delay) => {
  const savedCallback = useRef()
  const [timeoutId, setTimeoutId] = useState(null)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  const set = useCallback(() => {
    const id = setTimeout(() => savedCallback.current(), delay)
    setTimeoutId(id)
  }, [delay])

  const clear = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
  }, [timeoutId])

  return { set, clear }
}

export default useTimeout
