const React = require('react');
const { AbsoluteFill, Sequence, Img, Audio, staticFile } = require('remotion');

const SLIDES = [
  'slide-01.png',
  'slide-02.png',
  'slide-03.png',
  'slide-04.png',
  'slide-05.png',
  'slide-06.png',
  'slide-07.png',
  'slide-08.png',
];

// 53.397333s de narração a 30fps = 1602 frames, dividido em 8 blocos
// (7 blocos de 200 + 1 de 202 pra fechar o total exato)
const SLIDE_DURATIONS = [200, 200, 200, 200, 200, 200, 200, 202];

function Slide({ file }) {
  return React.createElement(AbsoluteFill, {
    style: { backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' },
  },
    React.createElement(Img, {
      src: staticFile(`c4-reels/${file}`),
      style: { width: 1080, height: 1350, objectFit: 'contain' },
    })
  );
}

function SlideshowC4Reels() {
  let offset = 0;
  const sequences = SLIDES.map((file, i) => {
    const from = offset;
    const durationInFrames = SLIDE_DURATIONS[i];
    offset += durationInFrames;
    return React.createElement(Sequence, {
      key: file,
      from,
      durationInFrames,
      name: file,
    }, React.createElement(Slide, { file }));
  });

  return React.createElement(AbsoluteFill, { style: { backgroundColor: '#1A1A1A' } },
    ...sequences,
    React.createElement(Audio, { src: staticFile('c4-reels/narracao.mp4') })
  );
}

module.exports = { SlideshowC4Reels, SLIDE_DURATIONS };
