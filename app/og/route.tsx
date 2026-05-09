// app/og/route.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'Asuma - Bot WhatsApp Premium'
    const description = searchParams.get('description') || 'Jadibot instan, pairing cepat, online 24 jam'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#030712',
            backgroundImage: 'linear-gradient(to bottom right, #1e3a8a, #0e7490)',
            padding: '80px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '60px 80px',
              maxWidth: '900px',
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: 'white',
                textAlign: 'center',
                marginBottom: 20,
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 32,
                color: '#94a3b8',
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              {description}
            </div>
            <div
              style={{
                marginTop: 40,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                backgroundColor: 'rgba(59,130,246,0.2)',
                borderRadius: 12,
                padding: '12px 24px',
                border: '1px solid rgba(59,130,246,0.3)',
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  color: '#60a5fa',
                  fontWeight: 600,
                }}
              >
                asuma.my.id
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    return new Response('Failed to generate image', { status: 500 })
  }
}
