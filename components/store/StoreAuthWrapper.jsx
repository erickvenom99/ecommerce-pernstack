'use client'

import { SignIn, useAuth } from '@clerk/nextjs'
import StoreLayout from "./StoreLayout"

export default function StoreAuthWrapper({ children }) {
  const { isLoaded, userId } = useAuth()

  // 1. Wait for Clerk to initialize so it doesn't flash the login screen layout
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500 animate-pulse">Initializing security verification...</p>
      </div>
    )
  }

  // 2. If the user is authenticated, render the layout normally
  if (userId) {
    return (
      <StoreLayout>
        {children}
      </StoreLayout>
    )
  }

  // 3. If the user is signed out, force the login screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn mode="modal" forceRedirectUrl="/store" routing="hash" />
    </div>
  )
}