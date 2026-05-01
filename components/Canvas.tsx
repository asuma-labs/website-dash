'use client'

import { useRef, useState, useCallback } from 'react'
import { Pencil, Eraser, Download, Trash2, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const [color, setColor] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(3)

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    
    setIsDrawing(true)
    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color
    ctx.lineWidth = tool === 'eraser' ? 20 : lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [tool, color, lineWidth])

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    const pos = getPos(e)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  }, [isDrawing])

  const stopDraw = useCallback(() => {
    setIsDrawing(false)
  }, [])

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, 800, 600)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 800, 600)
    toast.success('Canvas cleared')
  }

  const downloadImage = () => {
    const dataUrl = canvasRef.current?.toDataURL('image/png')
    if (!dataUrl) return
    
    const link = document.createElement('a')
    link.download = `canvas-${Date.now()}.png`
    link.href = dataUrl
    link.click()
    toast.success('Image downloaded')
  }

  const generateViaAPI = async () => {
    const dataUrl = canvasRef.current?.toDataURL('image/png')
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl })
      })
      
      const data = await res.json()
      
      if (data.success) {
        toast.success('Image generated successfully!')
      }
    } catch (error) {
      toast.error('Failed to generate image')
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-2 items-center flex-wrap bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <button
          onClick={() => setTool('pen')}
          className={`p-2 rounded-lg transition-all ${
            tool === 'pen' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Pen"
        >
          <Pencil size={20} />
        </button>

        <button
          onClick={() => setTool('eraser')}
          className={`p-2 rounded-lg transition-all ${
            tool === 'eraser' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Eraser"
        >
          <Eraser size={20} />
        </button>

        <div className="w-px h-8 bg-gray-300" />

        {tool === 'pen' && (
          <>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 cursor-pointer rounded border-2 border-gray-300"
            />
            <select
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value={1}>Thin</option>
              <option value={3}>Medium</option>
              <option value={5}>Thick</option>
              <option value={8}>Bold</option>
            </select>
          </>
        )}

        <div className="w-px h-8 bg-gray-300" />

        <button
          onClick={clearCanvas}
          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          title="Clear"
        >
          <Trash2 size={20} />
        </button>

        <button
          onClick={downloadImage}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          title="Download"
        >
          <Download size={20} />
        </button>

        <button
          onClick={generateViaAPI}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          title="Send to API"
        >
          <Send size={20} />
          <span className="text-sm font-medium">Generate</span>
        </button>
      </div>

      <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-xl bg-white">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="cursor-crosshair"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>
    </div>
  )
      }
