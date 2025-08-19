import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6 space-y-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">whatsapp-api</h1>
        <p className="text-sm text-gray-600">
          Vite + React + Tailwind v3.4 + shadcn/ui + Lucide + React-icons
        </p>

        {/* Icons demo */}
        <div className="flex items-center justify-center gap-4 text-emerald-600">
          <MessageCircle className="w-8 h-8" />
          <FaWhatsapp className="w-8 h-8" />
        </div>

        {/* Button demo */}
        <Button onClick={() => setCount((c) => c + 1)} className="w-full">
          Clicks: {count}
        </Button>
      </div>
    </div>
  )
}
