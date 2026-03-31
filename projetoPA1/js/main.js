const scripts = [
  "js/geometry/base/matrix.js",
  "js/geometry/base/mesh.js",
  "js/geometry/base/core.js",
  "js/geometry/base/profiles.js",
  "js/geometry/base/primitives.js",
  "js/geometry/base/advanced.js",

  "js/geometry/realism/head_torso.js",
  "js/geometry/realism/pelvis_shorts_legs.js",
  "js/geometry/realism/arms_hands.js",
  "js/geometry/realism/shoes_ball.js",

  "js/scene/textures.js",

  "js/scene/scene.js",
  "js/scene/lights.js",
  "js/scene/field.js",
  "js/scene/stands.js",

  "js/robot/all.js",
  "js/robot/input.js",
  "js/robot/torso.js",
  "js/robot/head.js",
  "js/robot/arms.js",
  "js/robot/bottom.js",
  "js/robot/animation.js",

  "sketch.js",
];

function loadScriptSequentially(index = 0) {
  if (index >= scripts.length) return;

  const s = document.createElement("script");
  s.src = scripts[index];
  s.onload = () => loadScriptSequentially(index + 1);
  document.body.appendChild(s);
}

loadScriptSequentially();
