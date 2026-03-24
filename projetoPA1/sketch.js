function preload() {
  loadTextures();
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(RADIANS);

  initScene();
  initRobot();
}
function draw() {
  background(6, 8, 14);

  updateRobot();

  setupSceneCamera();
  setupSceneLights();

  drawScene();
  // drawRobot();
  drawFootball();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key === "r" || key === "R") {
    resetRobotPose();
  }

  if (key === " ") {
    triggerKick("right");
  }

  if (key === "c" || key === "C") {
    Scene.spotlightFollowRobot = !Scene.spotlightFollowRobot;
  }
}
