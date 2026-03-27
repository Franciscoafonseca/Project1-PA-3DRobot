function drawHead(root) {
  const neckBase = Mat4.compose(root, Mat4.translation(0, -88, 0));
  drawPart(robotMeshes.neck, neckBase, "skin");

  const headPivot = Mat4.compose(
    neckBase,
    Mat4.translation(0, -12, 0),
    Mat4.rotateY(robot.headYaw),
    Mat4.rotateX(robot.headPitch),
  );

  const head = Mat4.compose(headPivot, Mat4.translation(0, -22, 0));
  drawPart(robotMeshes.head, head, "skin");

  if (robotMeshes.facePanel) {
    const facePanel = Mat4.compose(head, Mat4.translation(0, -2, 23));
    drawPanel(robotMeshes.facePanel, facePanel, "skin", "glass");
  }
}
