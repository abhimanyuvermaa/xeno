'use client'
import { Component } from 'react'
import { Button } from "@/components/ui/button"

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh] p-4">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">We apologize for the inconvenience</p>
          <Button
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}