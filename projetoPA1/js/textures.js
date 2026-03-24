// js/textures.js
// ============================================================
// FINAL TEXTURE SYSTEM - IMAGE BASED
// ============================================================

const Textures = {
  metal: null,
  plastic: null,
  leather: null,
  glass: null,
  skin: null,
};

function loadTextures() {
  Textures.metal = loadImage("assets/textures/metal.jpg");
  Textures.plastic = loadImage("assets/textures/plastico.png");
  Textures.leather = loadImage("assets/textures/shoeslether.jpg");
  Textures.glass = loadImage("assets/textures/vidro.png");
  Textures.skin = loadImage("assets/textures/pele.jpg");
}

function applyMaterial(type) {
  noStroke();

  switch (type) {
    case "metal":
      if (Textures.metal) texture(Textures.metal);
      ambientMaterial(165, 165, 170);
      specularMaterial(255, 255, 255);
      shininess(110);
      return true;

    case "plastic":
      if (Textures.plastic) texture(Textures.plastic);
      ambientMaterial(90, 95, 105);
      specularMaterial(150, 155, 165);
      shininess(22);
      return true;

    case "leather":
      if (Textures.leather) texture(Textures.leather);
      ambientMaterial(90, 60, 40);
      specularMaterial(140, 95, 70);
      shininess(28);
      return true;

    case "glass":
      if (Textures.glass) texture(Textures.glass);
      ambientMaterial(120, 180, 220);
      specularMaterial(255, 255, 255);
      shininess(150);
      return true;

    case "skin":
      if (Textures.skin) texture(Textures.skin);
      ambientMaterial(205, 175, 150);
      specularMaterial(120, 95, 85);
      shininess(10);
      return true;

    case "wall":
      ambientMaterial(22, 24, 30);
      specularMaterial(35, 38, 45);
      shininess(4);
      return false;

    case "floor":
      ambientMaterial(42, 44, 50);
      specularMaterial(80, 84, 90);
      shininess(14);
      return false;

    default:
      ambientMaterial(170, 170, 170);
      specularMaterial(90, 90, 90);
      shininess(10);
      return false;
  }
}

function applyEmissive(color = [0, 210, 255]) {
  noStroke();
  ambientMaterial(color[0], color[1], color[2]);
  specularMaterial(255, 255, 255);
  shininess(80);
  return false;
}
