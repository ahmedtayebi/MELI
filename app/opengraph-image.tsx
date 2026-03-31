import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'MELY•IMA — عباءات نسائية عصرية'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a1a1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px)',
        }} />

        {/* Accent line top */}
        <div style={{
          width: '80px',
          height: '3px',
          background: '#8B1A2E',
          marginBottom: '40px',
        }} />

        {/* Brand name */}
        <div style={{
          fontSize: '96px',
          fontWeight: '900',
          color: '#FFFFFF',
          letterSpacing: '-2px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          MELY
          <span style={{ color: '#8B1A2E' }}>•</span>
          IMA
        </div>

        {/* Tagline Arabic */}
        <div style={{
          fontSize: '32px',
          color: 'rgba(255,255,255,0.6)',
          marginTop: '24px',
          direction: 'rtl',
        }}>
          عباءات نسائية عصرية — الجزائر
        </div>

        {/* Accent line bottom */}
        <div style={{
          width: '120px',
          height: '2px',
          background: '#8B1A2E',
          marginTop: '40px',
          opacity: 0.5,
        }} />
      </div>
    ),
    { ...size }
  )
}
