class StorageService {
  constructor() {
    this.prefix = 'codeflux_'
  }

  setItem(key, value) {
    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(`${this.prefix}${key}`, serialized)
      return true
    } catch (error) {
      console.error('Failed to set item:', error)
      return false
    }
  }

  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(`${this.prefix}${key}`)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Failed to get item:', error)
      return defaultValue
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(`${this.prefix}${key}`)
      return true
    } catch (error) {
      console.error('Failed to remove item:', error)
      return false
    }
  }

  clear() {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
      return true
    } catch (error) {
      console.error('Failed to clear storage:', error)
      return false
    }
  }

  // User data
  saveUserData(userData) {
    return this.setItem('user', userData)
  }

  getUserData() {
    return this.getItem('user')
  }

  // Preferences
  savePreferences(preferences) {
    return this.setItem('preferences', preferences)
  }

  getPreferences() {
    return this.getItem('preferences', {})
  }

  // Draft notes
  saveDraft(key, content) {
    return this.setItem(`draft_${key}`, content)
  }

  getDraft(key) {
    return this.getItem(`draft_${key}`)
  }

  deleteDraft(key) {
    return this.removeItem(`draft_${key}`)
  }

  // Bookmarks
  addBookmark(itemId, itemData) {
    const bookmarks = this.getItem('bookmarks', [])
    if (!bookmarks.find(b => b.id === itemId)) {
      bookmarks.push({ id: itemId, ...itemData, savedAt: new Date().toISOString() })
      return this.setItem('bookmarks', bookmarks)
    }
    return false
  }

  removeBookmark(itemId) {
    const bookmarks = this.getItem('bookmarks', [])
    const filtered = bookmarks.filter(b => b.id !== itemId)
    return this.setItem('bookmarks', filtered)
  }

  getBookmarks() {
    return this.getItem('bookmarks', [])
  }
}

export default new StorageService()
