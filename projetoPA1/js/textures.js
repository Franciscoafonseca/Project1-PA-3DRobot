// js/textures.js
// ============================================================
// CLEAN MATERIAL SYSTEM - NO IMAGE TEXTURES FOR NOW
// ============================================================

const Textures = {
  metal: null,
  plastic: null,
  fabric: null,
  leather: null,
  glass: null,
  skin: null,
};

function loadTextures() {
  // desligado temporariamente
}

function getTexture(name) {
  return null;
}

function applyTexture(name) {
  // desligado temporariamente
}

function applyMaterial(type) {
  noStroke();

  switch (type) {
    case "metal":
      ambientMaterial(150, 150, 155);
      specularMaterial(255, 255, 255);
      shininess(120);
      break;

    case "plastic":
      ambientMaterial(55, 55, 65);
      specularMaterial(110, 110, 120);
      shininess(18);
      break;

    case "fabric":
      ambientMaterial(70, 70, 75);
      specularMaterial(25, 25, 25);
      shininess(3);
      break;

    case "leather":
      ambientMaterial(55, 35, 25);
      specularMaterial(95, 60, 40);
      shininess(20);
      break;

    case "glass":
      ambientMaterial(80, 150, 190);
      specularMaterial(255, 255, 255);
      shininess(180);
      break;

    case "skin":
      ambientMaterial(205, 175, 150);
      specularMaterial(110, 90, 80);
      shininess(8);
      break;

    case "wall":
      ambientMaterial(22, 24, 30);
      specularMaterial(35, 38, 45);
      shininess(4);
      break;

    case "floor":
      ambientMaterial(42, 44, 50);
      specularMaterial(80, 84, 90);
      shininess(14);
      break;

    default:
      ambientMaterial(170, 170, 170);
      specularMaterial(90, 90, 90);
      shininess(10);
      break;
  }
}

function applyEmissive(color = [0, 210, 255]) {
  noStroke();
  emissiveMaterial(color[0], color[1], color[2]);
}

function applyRobotPartMaterial(part) {
  switch (part) {
    case "torso":
    case "upperArm":
    case "foreArm":
    case "thigh":
    case "shin":
    case "joint":
    case "neck":
      applyMaterial("metal");
      break;

    case "head":
    case "pelvis":
    case "hand":
      applyMaterial("plastic");
      break;

    case "foot":
    case "shoe":
      applyMaterial("leather");
      break;

    case "visor":
    case "screen":
      applyMaterial("glass");
      break;

    case "skin":
    case "face":
      applyMaterial("skin");
      break;

    default:
      applyMaterial("metal");
      break;
  }
}
