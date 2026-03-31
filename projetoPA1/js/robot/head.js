// ------------------------------------------------------------
// Desenha a cabeça a partir do tronco.
// O pescoço é desenhado primeiro e depois a cabeça roda
// em yaw e pitch sobre o pivot definido.
// ------------------------------------------------------------
function drawHead(root) {
  const neckBase = Mat4.compose(root, Mat4.translation(0, -58, 0));
  drawPart(robotMeshes.neck, neckBase, "skin");

  const headPivot = Mat4.compose(
    neckBase,
    Mat4.translation(0, -13, 0),
    Mat4.rotateY(robot.headYaw),
    Mat4.rotateX(robot.headPitch),
  );

  const head = Mat4.compose(headPivot, Mat4.translation(0, -20, 0));

  drawPart(robotMeshes.head, head, "skin");

  drawHeadHair(head);
  drawHeadEars(head);
  drawHeadFace(head);
}

// ------------------------------------------------------------
// Desenha os vários blocos do cabelo.
// ------------------------------------------------------------
function drawHeadHair(headMatrix) {
  if (robotMeshes.hairTopBar) {
    const topBar = Mat4.compose(headMatrix, Mat4.translation(0, -25.5, -3.0));
    drawPart(robotMeshes.hairTopBar, topBar, "hair");
  }

  if (robotMeshes.hairBackBar) {
    const backBar = Mat4.compose(headMatrix, Mat4.translation(0, 0.5, -19.5));
    drawPart(robotMeshes.hairBackBar, backBar, "hair");
  }

  if (robotMeshes.hairSideL) {
    const sideL = Mat4.compose(headMatrix, Mat4.translation(-13.8, 0.5, -9.5));
    drawPart(robotMeshes.hairSideL, sideL, "hair");
  }

  if (robotMeshes.hairSideR) {
    const sideR = Mat4.compose(headMatrix, Mat4.translation(13.8, 0.5, -9.5));
    drawPart(robotMeshes.hairSideR, sideR, "hair");
  }
}

// ------------------------------------------------------------
// Desenha as orelhas com uma ligeira rotação para fora.
// ------------------------------------------------------------
function drawHeadEars(headMatrix) {
  if (!robotMeshes.ear) return;

  const leftEar = Mat4.compose(
    headMatrix,
    Mat4.translation(-29, -1, 1.5),
    Mat4.rotateY(-0.12),
  );

  const rightEar = Mat4.compose(
    headMatrix,
    Mat4.translation(29, -1, 1.5),
    Mat4.rotateY(0.12),
  );

  drawPart(robotMeshes.ear, leftEar, "metal");
  drawPart(robotMeshes.ear, rightEar, "metal");
}

// ------------------------------------------------------------
// Agrupa os elementos principais da cara.
// ------------------------------------------------------------
function drawHeadFace(headMatrix) {
  if (robotMeshes.visor) {
    const visor = Mat4.compose(headMatrix, Mat4.translation(0, -8.5, 22.0));
    drawPanel(robotMeshes.visor, visor, "metal", "led_blue");
  }

  drawHeadLeds(headMatrix);
  drawNose(headMatrix);
  drawMoustache(headMatrix);
}

// ------------------------------------------------------------
// LEDs frontais dos olhos.
// ------------------------------------------------------------
function drawHeadLeds(headMatrix) {
  if (!robotMeshes.eyeLed) return;

  const leftEye = Mat4.compose(headMatrix, Mat4.translation(-7.8, -8.2, 22.4));
  const rightEye = Mat4.compose(headMatrix, Mat4.translation(7.8, -8.2, 22.4));

  drawPart(robotMeshes.eyeLed, leftEye, "led_blue");
  drawPart(robotMeshes.eyeLed, rightEye, "led_blue");
}

// ------------------------------------------------------------
// Nariz metálico frontal.
// ------------------------------------------------------------
function drawNose(headMatrix) {
  if (!robotMeshes.nose) return;

  const nose = Mat4.compose(
    headMatrix,
    Mat4.translation(0, 4.4, 23.7),
    Mat4.rotateX(Math.PI / 2),
  );

  drawPart(robotMeshes.nose, nose, "metal");
}

// ------------------------------------------------------------
// Bigode frontal.
// ------------------------------------------------------------
function drawMoustache(headMatrix) {
  if (!robotMeshes.moustache) return;

  const moustache = Mat4.compose(
    headMatrix,
    Mat4.translation(0, 10.0, 22.8),
    Mat4.scale(1.45, 1.18, 1.15),
  );

  drawPart(robotMeshes.moustache, moustache, "hair");
}
