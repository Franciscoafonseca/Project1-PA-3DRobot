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

function applyTexture(type) {
  switch (type) {
    case "metal":
      if (Textures.metal) {
        texture(Textures.metal);
        return true;
      }
      return false;
    case "plastic":
      if (Textures.plastic) {
        texture(Textures.plastic);
        return true;
      }
      return false;
    case "leather":
      if (Textures.leather) {
        texture(Textures.leather);
        return true;
      }
      return false;
    case "glass":
      if (Textures.glass) {
        texture(Textures.glass);
        return true;
      }
      return false;
    case "skin":
      if (Textures.skin) {
        texture(Textures.skin);
        return true;
      }
      return false;
    default:
      return false;
  }
}

function applyMaterial(type, textureType = type) {
  noStroke();
  const hasTexture = applyTexture(textureType);

  switch (type) {
    case "metal":
      ambientMaterial(150, 152, 160);
      specularMaterial(255, 255, 255);
      shininess(190);
      return hasTexture;

    case "plastic":
      ambientMaterial(92, 98, 108);
      specularMaterial(95, 100, 110);
      shininess(10);
      return hasTexture;

    case "leather":
      ambientMaterial(88, 58, 40);
      specularMaterial(55, 40, 28);
      shininess(5);
      return hasTexture;

    case "glass":
      ambientMaterial(120, 180, 220);
      specularMaterial(255, 255, 255);
      shininess(220);
      return hasTexture;

    case "skin":
      ambientMaterial(205, 175, 150);
      specularMaterial(120, 95, 85);
      shininess(10);
      return hasTexture;

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
