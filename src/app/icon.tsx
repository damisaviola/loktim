import { ImageResponse } from 'next/og';


// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 20,
          background: '#1c4ed8', // var(--primary) in light mode
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: 8, // equivalent to rounded-lg
          fontWeight: 700, // font-bold
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        LT
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
