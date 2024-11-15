// providers/toast-provider.jsx
"use client"

import { Toaster } from "@/components/ui/toaster"

export function ToastProvider({ children }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}