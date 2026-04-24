const React = require('react');
const { useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } = require('remotion');

function SceneSolution() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const photoScale = interpolate(frame, [0, 120], [1.0, 1.08], { extrapolateRight: 'clamp' });
  const overlayO = interpolate(frame, [0, 8], [0.5, 0.82], { extrapolateRight: 'clamp' });

  const brandScale = spring({ frame, fps, config: { damping: 14, stiffness: 100 }, from: 0.6, to: 1 });
  const brandO = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  const l1O = interpolate(frame, [10, 20], [0, 1], { extrapolateRight: 'clamp' });
  const l1Y = interpolate(frame, [10, 22], [30, 0], { extrapolateRight: 'clamp' });

  const l2O = interpolate(frame, [18, 28], [0, 1], { extrapolateRight: 'clamp' });
  const l2Y = interpolate(frame, [18, 30], [30, 0], { extrapolateRight: 'clamp' });

  const barW = interpolate(frame, [24, 44], [0, 360], { extrapolateRight: 'clamp' });

  return React.createElement('div', {
    style: {
      width: '100%', height: '100%',
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }
  },
    // Photo: estoque_lineup — full fleet lineup
    React.createElement(Img, {
      src: staticFile('estoque_lineup.jpg'),
      style: {
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center',
        transform: `scale(${photoScale})`,
      },
    }),
    // Orange overlay
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
        alignItems: 'center', gap: 12,
        padding: '0 64px',
        textAlign: 'center',
      }
    },
      // Brand name — big impact
      React.createElement('p', {
        style: {
          opacity: brandO,
          transform: `scale(${brandScale})`,
          fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
          fontSize: 160, color: '#FFFFFF', margin: 0, lineHeight: 0.9,
          letterSpacing: -2,
        }
      }, 'FoccusBR'),
      // Divider bar
      React.createElement('div', {
        style: {
          width: barW, height: 6, backgroundColor: '#FFFFFF',
          borderRadius: 3, margin: '16px 0',
        }
      }),
      // Spec line
      React.createElement('p', {
        style: {
          opacity: l1O, transform: `translateY(${l1Y}px)`,
          fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
          fontSize: 80, color: '#FFFFFF', margin: 0, lineHeight: 1.1,
        }
      }, '22 Tesouras Elétricas'),
      // Availability
      React.createElement('p', {
        style: {
          opacity: l2O, transform: `translateY(${l2Y}px)`,
          fontFamily: 'Roboto Condensed, sans-serif', fontWeight: 400,
          fontSize: 56, color: '#FFD0B0', margin: 0,
          textTransform: 'uppercase', letterSpacing: 4,
        }
      }, 'Disponíveis Agora'),
    )
  );
}

module.exports = { SceneSolution };
