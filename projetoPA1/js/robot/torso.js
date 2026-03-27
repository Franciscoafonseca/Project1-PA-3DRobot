function drawTorso(root) {
  drawPart(robotMeshes.torso, root, "jersey");

  if (robotMeshes.chestPanel) {
    const chestPanel = Mat4.compose(root, Mat4.translation(0, -10, 26));
    drawPanel(robotMeshes.chestPanel, chestPanel, "jersey", "glass");
  }
}

function drawShorts(pelvisMatrix) {
  const shortsMatrix = Mat4.compose(pelvisMatrix, Mat4.translation(0, 4, 0));
  drawPart(robotMeshes.shorts, shortsMatrix, "shorts");
}
