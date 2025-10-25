"use client"

import { useState, useEffect } from 'react'


export type User = {
  id: string
  name: string
  email: string
  avatar?: string | null
  role?: string
  user_type?: string
  active?: boolean
}


export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    
    async function fetchUser() {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      if (response.ok) {
        setUser(null)
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return { user, loading, logout }
}
