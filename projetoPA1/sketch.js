function preload() {
  loadTextures();
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(RADIANS);
  textureMode(NORMAL);
  initInput();
  initScene();
  initRobot();
}

function draw() {
  background(6, 8, 14);

  updateInput();
  updateRobot();

  setupSceneCamera();
  setupSceneLights();

  drawScene();
  drawRobot();
  drawFootball();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  handleKeyPressed(key, keyCode);
}

function keyReleased() {
  handleKeyReleased(key, keyCode);
}
