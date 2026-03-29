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

  // cabeça com pele
  drawPart(robotMeshes.head, head, "skin");

  drawHeadHair(head);
  drawHeadEars(head);
  drawHeadFace(head);
}

function drawHeadHair(headMatrix) {
  // topo mais comprido para a frente e para trás
  if (robotMeshes.hairTopBar) {
    const topBar = Mat4.compose(headMatrix, Mat4.translation(0, -25.5, -3.0));
    drawPart(robotMeshes.hairTopBar, topBar, "hair");
  }

  // trás puxado um pouco para a frente para unir com o topo
  if (robotMeshes.hairBackBar) {
    const backBar = Mat4.compose(headMatrix, Mat4.translation(0, 0.5, -19.5));
    drawPart(robotMeshes.hairBackBar, backBar, "hair");
  }

  // laterais mais compridas para fechar a estrutura
  if (robotMeshes.hairSideL) {
    const sideL = Mat4.compose(headMatrix, Mat4.translation(-13.8, 0.5, -9.5));
    drawPart(robotMeshes.hairSideL, sideL, "hair");
  }

  if (robotMeshes.hairSideR) {
    const sideR = Mat4.compose(headMatrix, Mat4.translation(13.8, 0.5, -9.5));
    drawPart(robotMeshes.hairSideR, sideR, "hair");
  }
}

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

function drawHeadFace(headMatrix) {
  if (robotMeshes.visor) {
    // mais colado à cara
    const visor = Mat4.compose(headMatrix, Mat4.translation(0, -8.5, 22.0));
    drawPanel(robotMeshes.visor, visor, "metal", "glass");
  }

  drawHeadLeds(headMatrix);
  drawNose(headMatrix);
  drawMoustache(headMatrix);
}

function drawHeadLeds(headMatrix) {
  if (!robotMeshes.eyeLed) return;

  // mais próximos do centro e mais colados à cara
  const leftEye = Mat4.compose(headMatrix, Mat4.translation(-7.8, -8.2, 22.4));

  const rightEye = Mat4.compose(headMatrix, Mat4.translation(7.8, -8.2, 22.4));

  drawPart(robotMeshes.eyeLed, leftEye, "glass");
  drawPart(robotMeshes.eyeLed, rightEye, "glass");
}

function drawNose(headMatrix) {
  if (!robotMeshes.nose) return;

  const nose = Mat4.compose(
    headMatrix,
    Mat4.translation(0, 4.4, 23.7),
    Mat4.rotateX(Math.PI / 2),
  );

  drawPart(robotMeshes.nose, nose, "metal");
}

function drawMoustache(headMatrix) {
  if (!robotMeshes.moustache) return;

  const moustache = Mat4.compose(headMatrix, Mat4.translation(0, 10.6, 24.0));

  drawPart(robotMeshes.moustache, moustache, "hair");
}
