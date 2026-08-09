const React = require('react');
const { Composition, AbsoluteFill, Sequence } = require('remotion');
const { SceneHook } = require('./SceneHook');
const { SceneProblem } = require('./SceneProblem');
const { SceneSolution } = require('./SceneSolution');
const { SceneBenefits } = require('./SceneBenefits');
const { SceneCTA } = require('./SceneCTA');
const { SlideshowC4Reels, SLIDE_DURATIONS } = require('./SlideshowC4Reels');

const FPS = 30;

// Scene durations in seconds
const SCENES = [
  { component: SceneHook,     durationSec: 3  }, // 0–3s
  { component: SceneProblem,  durationSec: 3  }, // 3–6s
  { component: SceneSolution, durationSec: 4  }, // 6–10s
  { component: SceneBenefits, durationSec: 3  }, // 10–13s
  { component: SceneCTA,      durationSec: 2  }, // 13–15s
];

const TOTAL_FRAMES = SCENES.reduce((acc, s) => acc + s.durationSec * FPS, 0); // 450

function FoccusBRVideo() {
  let offset = 0;
  return React.createElement(AbsoluteFill, { style: { backgroundColor: '#1A1A1A' } },
    SCENES.map((scene, i) => {
      const from = offset;
      const durationInFrames = scene.durationSec * FPS;
      offset += durationInFrames;
      return React.createElement(Sequence, {
        key: i,
        from,
        durationInFrames,
        name: scene.component.name,
      },
        React.createElement(scene.component)
      );
    })
  );
}

const C4_REELS_TOTAL_FRAMES = SLIDE_DURATIONS.reduce((a, b) => a + b, 0); // 1602 = 53.4s a 30fps

function RemotionRoot() {
  return React.createElement(React.Fragment, null,
    React.createElement(Composition, {
      id: 'FoccusBRVideo',
      component: FoccusBRVideo,
      durationInFrames: TOTAL_FRAMES,
      fps: FPS,
      width: 1080,
      height: 1920,
    }),
    React.createElement(Composition, {
      id: 'C4BrasilInteiroReels',
      component: SlideshowC4Reels,
      durationInFrames: C4_REELS_TOTAL_FRAMES,
      fps: FPS,
      width: 1080,
      height: 1920,
    })
  );
}

module.exports = { RemotionRoot };
