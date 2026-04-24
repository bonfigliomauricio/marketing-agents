const React = require('react');
const { useCurrentFrame, interpolate } = require('remotion');

function SceneProblem() {
  const frame = useCurrentFrame();

  const pulse = 1 + Math.sin(frame * 0.28) * 0.08;

  const iconO = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const iconScale = interpolate(frame, [0, 12], [0.4, 1], { extrapolateRight: 'clamp' });

  const arrowY = interpolate(frame, [8, 28], [0, 24], { extrapolateRight: 'clamp' });
  const arrowO = interpolate(frame, [6, 16], [0, 1], { extrapolateRight: 'clamp' });

  const l1O = interpolate(frame, [8, 18], [0, 1], { extrapolateRight: 'clamp' });
  const l1Y = interpolate(frame, [8, 20], [30, 0], { extrapolateRight: 'clamp' });

  const l2O = interpolate(frame, [14, 24], [0, 1], { extrapolateRight: 'clamp' });
  const l2Y = interpolate(frame, [14, 26], [30, 0], { extrapolateRight: 'clamp' });

  const l3O = interpolate(frame, [20, 30], [0, 1], { extrapolateRight: 'clamp' });
  const l3Y = interpolate(frame, [20, 32], [30, 0], { extrapolateRight: 'clamp' });

  return React.createElement('div', {
    style: {
      width: '100%', height: '100%', backgroundColor: '#1A1A1A',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 64px', gap: 56,
    }
  },
    // Icons row
    React.createElement('div', {
      style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 64 }
    },
      // Danger triangle — pulsing
      React.createElement('div', {
        style: {
          opacity: iconO,
          transform: `scale(${iconScale * pulse})`,
        }
      },
        React.createElement('svg', { width: 200, height: 180, viewBox: '0 0 200 180', fill: 'none' },
          React.createElement('polygon', {
            points: '100,12 192,172 8,172',
            fill: 'none', stroke: '#E85A00', strokeWidth: 10, strokeLinejoin: 'round',
          }),
          React.createElement('rect', { x: 92, y: 56, width: 16, height: 60, rx: 8, fill: '#E85A00' }),
          React.createElement('circle', { cx: 100, cy: 145, r: 10, fill: '#E85A00' }),
        )
      ),
      // Productivity down arrow
      React.createElement('div', {
        style: { opacity: arrowO, transform: `translateY(${arrowY}px)` }
      },
        React.createElement('svg', { width: 100, height: 180, viewBox: '0 0 100 180', fill: 'none' },
          React.createElement('line', {
            x1: 50, y1: 10, x2: 50, y2: 120,
            stroke: '#6B6B6B', strokeWidth: 14, strokeLinecap: 'round',
          }),
          React.createElement('polygon', { points: '50,170 10,100 90,100', fill: '#6B6B6B' }),
        )
      ),
    ),
    // Problem copy — staggered
    React.createElement('div', { style: { textAlign: 'center', width: '100%' } },
      React.createElement('p', {
        style: {
          opacity: l1O, transform: `translateY(${l1Y}px)`,
          fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
          fontSize: 88, color: '#FFFFFF', margin: '0 0 4px', lineHeight: 1,
        }
      }, 'Andaime'),
      React.createElement('p', {
        style: {
          opacity: l1O, transform: `translateY(${l1Y}px)`,
          fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
          fontSize: 88, color: '#FFFFFF', margin: '0 0 24px', lineHeight: 1,
        }
      }, 'improvisado.'),
      React.createElement('p', {
        style: {
          opacity: l2O, transform: `translateY(${l2Y}px)`,
          fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
          fontSize: 140, color: '#E85A00', margin: '0 0 4px', lineHeight: 0.9,
        }
      }, 'RISCO.'),
      React.createElement('p', {
        style: {
          opacity: l3O, transform: `translateY(${l3Y}px)`,
          fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
          fontSize: 72, color: '#6B6B6B', margin: 0, lineHeight: 1,
        }
      }, 'Improdutividade.'),
    )
  );
}

module.exports = { SceneProblem };
