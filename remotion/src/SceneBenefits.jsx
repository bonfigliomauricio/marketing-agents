const React = require('react');
const { useCurrentFrame, interpolate, Img, staticFile } = require('remotion');

function BenefitRow({ label, value, delayStart, frame }) {
  const o = interpolate(frame, [delayStart, delayStart + 10], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const x = interpolate(frame, [delayStart, delayStart + 14], [-50, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const checkScale = interpolate(frame, [delayStart, delayStart + 8], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return React.createElement('div', {
    style: {
      display: 'flex', alignItems: 'center', gap: 28,
      opacity: o, transform: `translateX(${x}px)`,
    }
  },
    // Orange checkmark
    React.createElement('svg', {
      width: 56, height: 56, viewBox: '0 0 56 56', fill: 'none', flexShrink: 0,
      style: { transform: `scale(${checkScale})`, flexShrink: 0 },
    },
      React.createElement('circle', { cx: 28, cy: 28, r: 27, fill: '#E85A00' }),
      React.createElement('polyline', {
        points: '14,28 23,38 42,18',
        stroke: '#FFFFFF', strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none',
      }),
    ),
    React.createElement('div', null,
      React.createElement('p', {
        style: {
          fontFamily: 'Roboto Condensed, sans-serif', fontWeight: 400,
          fontSize: 36, color: '#FFFFFF', margin: 0,
          textTransform: 'uppercase', letterSpacing: 2, opacity: 0.7,
        }
      }, label),
      React.createElement('p', {
        style: {
          fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
          fontSize: 72, color: '#FFFFFF', margin: 0, lineHeight: 1.05,
        }
      }, value),
    )
  );
}

function SceneBenefits() {
  const frame = useCurrentFrame();

  const photoScale = interpolate(frame, [0, 90], [1.05, 1.1], { extrapolateRight: 'clamp' });
  const overlayO = interpolate(frame, [0, 8], [0.55, 0.78], { extrapolateRight: 'clamp' });

  const labelO = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const barW = interpolate(frame, [4, 20], [0, 260], { extrapolateRight: 'clamp' });

  return React.createElement('div', {
    style: {
      width: '100%', height: '100%',
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center',
    }
  },
    // Photo: tesoura_14m
    React.createElement(Img, {
      src: staticFile('tesoura_14m.jpg'),
      style: {
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center',
        transform: `scale(${photoScale})`,
      },
    }),
    // Dark overlay
    React.createElement('div', {
      style: {
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(26,26,26,0.85) 0%, rgba(26,26,26,0.70) 100%)',
        opacity: overlayO,
      }
    }),
    // Content
    React.createElement('div', {
      style: {
        position: 'relative', zIndex: 2,
        padding: '0 64px',
        display: 'flex', flexDirection: 'column', gap: 48, width: '100%',
      }
    },
      // Section label + bar
      React.createElement('div', { style: { opacity: labelO } },
        React.createElement('p', {
          style: {
            fontFamily: 'Roboto Condensed, sans-serif', fontWeight: 400,
            fontSize: 40, color: '#E85A00', margin: '0 0 12px',
            textTransform: 'uppercase', letterSpacing: 4,
          }
        }, 'Especificações'),
        React.createElement('div', {
          style: { width: barW, height: 5, backgroundColor: '#E85A00', borderRadius: 3 }
        }),
      ),
      // Rows
      React.createElement(BenefitRow, { label: 'Altura de trabalho', value: '6 a 14 Metros', delayStart: 6, frame }),
      React.createElement(BenefitRow, { label: 'Operação', value: 'Elétrica · Int. e Ext.', delayStart: 16, frame }),
      React.createElement(BenefitRow, { label: 'Atendimento', value: 'Piracicaba e Região', delayStart: 26, frame }),
    )
  );
}

module.exports = { SceneBenefits };
