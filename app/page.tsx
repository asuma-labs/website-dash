import Canvas from '@/components/Canvas'
import { Toaster } from 'react-hot-toast'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Canvas Board
          </h1>
          <p className="text-gray-600 mt-2">
            Draw, download, or generate via API
          </p>
        </div>
        
        <Canvas />
      </div>
    </main>
  )
}
