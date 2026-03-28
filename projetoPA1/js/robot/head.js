function drawHead(root) {
  const neckBase = Mat4.compose(root, Mat4.translation(0, -58, 0));
  drawPart(robotMeshes.neck, neckBase, "metal");

  const headPivot = Mat4.compose(
    neckBase,
    Mat4.translation(0, -13, 0),
    Mat4.rotateY(robot.headYaw),
    Mat4.rotateX(robot.headPitch),
  );

  const head = Mat4.compose(headPivot, Mat4.translation(0, -20, 0));
  drawPart(robotMeshes.head, head, "metal");

  if (robotMeshes.facePanel) {
    const facePanel = Mat4.compose(head, Mat4.translation(0, -2, 22.5));
    drawPanel(robotMeshes.facePanel, facePanel, "metal", "glass");
  }

  drawHeadLeds(head);
}
function drawHeadLeds(headMatrix) {
  if (!robotMeshes.eyeLed) return;

  const leftEye = Mat4.compose(headMatrix, Mat4.translation(-8, -5, 23.5));
  const rightEye = Mat4.compose(headMatrix, Mat4.translation(8, -5, 23.5));

  drawPart(robotMeshes.eyeLed, leftEye, "glass");
  drawPart(robotMeshes.eyeLed, rightEye, "glass");
}
