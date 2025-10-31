import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const size = {
  width: 512,
  height: 512,
}
 
export const contentType = 'image/png'
 
export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f3a2e',
          borderRadius: '50%',
        }}
      >
        <img
          src="https://alrehmatonline.vercel.app/white-logo.png"
          alt="LearnQuraan Logo"
          width="380"
          height="380"
          style={{
            objectFit: 'contain',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
