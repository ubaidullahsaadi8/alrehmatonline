"use client"

import React from 'react'

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4">
      {children}
    </div>
  )
}
