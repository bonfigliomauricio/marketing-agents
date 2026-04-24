const React = require('react');
const { useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } = require('remotion');

function SceneHook() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns — slow zoom on photo
  const photoScale = interpolate(frame, [0, 90], [1.05, 1.15], { extrapolateRight: 'clamp' });

  // Overlay fades in quickly
  const overlayOpacity = interpolate(frame, [0, 10], [0.3, 0.62], { extrapolateRight: 'clamp' });

  // Line 1
  const l1Y = interpolate(frame, [4, 16], [40, 0], { extrapolateRight: 'clamp' });
  const l1O = interpolate(frame, [4, 14], [0, 1], { extrapolateRight: 'clamp' });

  // Line 2
  const l2Y = interpolate(frame, [10, 22], [40, 0], { extrapolateRight: 'clamp' });
  const l2O = interpolate(frame, [10, 20], [0, 1], { extrapolateRight: 'clamp' });

  // Line 3 + accent bar
  const l3Y = interpolate(frame, [16, 28], [40, 0], { extrapolateRight: 'clamp' });
  const l3O = interpolate(frame, [16, 26], [0, 1], { extrapolateRight: 'clamp' });

  const barW = interpolate(frame, [22, 38], [0, 220], { extrapolateRight: 'clamp' });

  return React.createElement('div', {
    style: {
      width: '100%', height: '100%',
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'flex-end',
    }
  },
    // Photo background
    React.createElement(Img, {
      src: staticFile('tesoura_logo_lateral.jpg'),
      style: {
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center',
        transform: `scale(${photoScale})`,
        transformOrigin: 'center center',
      },
    }),
    // Dark gradient overlay — heavier at bottom for text legibility
    React.createElement('div', {
      style: {
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.75) 100%)',
        opacity: overlayOpacity,
      }
    }),
    // Text block — anchored to bottom
    React.createElement('div', {
      style: {
        position: 'relative', zIndex: 2,
        padding: '0 64px 120px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }
    },
      // Eyebrow label
      React.createElement('p', {
        style: {
          opacity: l1O, transform: `translateY(${l1Y}px)`,
          fontFamily: 'Roboto Condensed, sans-serif', fontWeight: 400,
          fontSize: 38, color: '#E85A00', margin: 0,
          textTransform: 'uppercase', letterSpacing: 4,
        }
      }, 'Plataforma Elevatória'),
      // Line 1
      React.createElement('p', {
        style: {
          opacity: l2O, transform: `translateY(${l2Y}px)`,
          fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
          fontSize: 128, color: '#FFFFFF', margin: 0, lineHeight: 0.95,
        }
      }, 'Trabalho'),
      // Line 2
      React.createElement('p', {
        style: {
          opacity: l2O, transform: `translateY(${l2Y}px)`,
          fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
          fontSize: 128, color: '#FFFFFF', margin: 0, lineHeight: 0.95,
        }
      }, 'em altura.'),
      // Line 3 — question
      React.createElement('p', {
        style: {
          opacity: l3O, transform: `translateY(${l3Y}px)`,
          fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
          fontSize: 80, color: '#E85A00', margin: '16px 0 0', lineHeight: 1.1,
        }
      }, 'Com plataforma segura?'),
      // Orange accent bar
      React.createElement('div', {
        style: {
          width: barW, height: 6, backgroundColor: '#E85A00',
          borderRadius: 3, marginTop: 20,
        }
      }),
    )
  );
}

module.exports = { SceneHook };
