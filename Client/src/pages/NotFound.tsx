"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function NotFoundPage() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate("/")
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-6">
          <div className="mb-6">
            <div className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-2">404</div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Page Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the
              wrong URL.
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={handleGoHome} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>

            <Button variant="outline" onClick={handleGoBack} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need help?{" "}
              <button
                onClick={() => navigate("/contact")}
                className="text-primary hover:underline bg-transparent border-none cursor-pointer"
              >
                Contact support
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
