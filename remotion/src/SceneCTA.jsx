const React = require('react');
const { useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } = require('remotion');

function SceneCTA() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const photoScale = interpolate(frame, [0, 60], [1.02, 1.1], { extrapolateRight: 'clamp' });
  const overlayO = interpolate(frame, [0, 8], [0.6, 0.88], { extrapolateRight: 'clamp' });

  const ctaScale = spring({ frame, fps, config: { damping: 13, stiffness: 95 }, from: 0.7, to: 1 });
  const ctaO = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  const subO = interpolate(frame, [10, 20], [0, 1], { extrapolateRight: 'clamp' });
  const subY = interpolate(frame, [10, 22], [20, 0], { extrapolateRight: 'clamp' });

  const tagO = interpolate(frame, [18, 28], [0, 1], { extrapolateRight: 'clamp' });

  const dotPulse = 1 + Math.sin(frame * 0.35) * 0.08;

  return React.createElement('div', {
    style: {
      width: '100%', height: '100%',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }
  },
    // Photo: tesoura_logo_frontal — logo visible
    React.createElement(Img, {
      src: staticFile('tesoura_logo_frontal.jpg'),
      style: {
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center',
        transform: `scale(${photoScale})`,
      },
    }),
    // Strong orange overlay
    React.createElement('div', {
      style: {
        position: 'absolute', inset: 0,
        backgroundColor: '#E85A00',
        opacity: overlayO,
      }
    }),
    // Content
    React.createElement('div', {
      style: {
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 20,
        padding: '0 60px', textAlign: 'center',
      }
    },
      // Main CTA
      React.createElement('div', {
        style: { opacity: ctaO, transform: `scale(${ctaScale})` }
      },
        React.createElement('p', {
          style: {
            fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
            fontSize: 130, color: '#FFFFFF', margin: 0, lineHeight: 0.92,
          }
        }, 'Consulte'),
        React.createElement('p', {
          style: {
            fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
            fontSize: 130, color: '#FFFFFF', margin: 0, lineHeight: 0.92,
          }
        }, 'o Estoque.'),
      ),
      // Brand lockup
      React.createElement('div', {
        style: {
          opacity: subO, transform: `translateY(${subY}px)`,
          display: 'flex', alignItems: 'center', gap: 14, marginTop: 16,
          transform: `translateY(${subY}px) scale(${dotPulse})`,
        }
      },
        React.createElement('div', {
          style: { width: 16, height: 16, borderRadius: '50%', backgroundColor: '#FFFFFF' }
        }),
        React.createElement('p', {
          style: {
            fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
            fontSize: 52, color: '#FFFFFF', margin: 0, letterSpacing: 1,
          }
        }, 'FoccusBR'),
        React.createElement('div', {
          style: { width: 16, height: 16, borderRadius: '50%', backgroundColor: '#FFFFFF' }
        }),
      ),
      // Tagline
      React.createElement('p', {
        style: {
          opacity: tagO,
          fontFamily: 'Roboto Condensed, sans-serif', fontWeight: 400,
          fontSize: 32, color: '#FFD0B0', margin: '8px 0 0',
          textTransform: 'uppercase', letterSpacing: 3,
        }
      }, '21 ANOS · ESTOQUE PRÓPRIO'),
    )
  );
}

module.exports = { SceneCTA };
