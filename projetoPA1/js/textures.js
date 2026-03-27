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
  jersey: null,
  shorts: null,
  sock: null,
  boots: null,
};

function loadTextures() {
  Textures.metal = loadImage("assets/textures/metal.jpg"); //
  Textures.plastic = loadImage("assets/textures/plastico.png"); //
  Textures.leather = loadImage("assets/textures/shoeslether.jpg"); //
  Textures.glass = loadImage("assets/textures/vidro.png"); //
  Textures.skin = loadImage("assets/textures/skin.jpg"); //
  Textures.metaldelado = loadImage("assets/textures/metal-pattern.jpg"); //

  Textures.jersey = loadImage("assets/textures/tecido.jpg"); //
  Textures.shorts = loadImage("assets/textures/shorts.jpg");
  Textures.sock = loadImage("assets/textures/sock.png");
  Textures.boots = loadImage("assets/textures/lether.jpg");
}

function applyMaterial(type) {
  noStroke();

  switch (type) {
    case "metal":
      if (Textures.metal) {
        texture(Textures.metal);
        ambientMaterial(165, 165, 170);
        specularMaterial(255, 255, 255);
        shininess(110);
        return true;
      }
      ambientMaterial(165, 165, 170);
      specularMaterial(255, 255, 255);
      shininess(110);
      return false;

    case "plastic":
      if (Textures.plastic) {
        texture(Textures.plastic);

        noStroke();
        return true;
      }
      ambientMaterial(90, 95, 105);
      specularMaterial(150, 155, 165);
      shininess(22);
      return false;

    case "leather":
      if (Textures.leather) {
        texture(Textures.leather);
        ambientMaterial(90, 60, 40);
        specularMaterial(140, 95, 70);
        shininess(28);
        return true;
      }
      ambientMaterial(90, 60, 40);
      specularMaterial(140, 95, 70);
      shininess(28);
      return false;

    case "glass":
      if (Textures.glass) {
        texture(Textures.glass);
        ambientMaterial(120, 180, 220);
        specularMaterial(255, 255, 255);
        shininess(150);
        return true;
      }
      ambientMaterial(120, 180, 220);
      specularMaterial(255, 255, 255);
      shininess(150);
      return false;

    case "skin":
      if (Textures.skin) {
        texture(Textures.skin);
        noStroke();
        return true;
      }
      ambientMaterial(165, 165, 170);
      specularMaterial(255, 255, 255);
      shininess(110);
      return false;

    case "jersey":
      if (Textures.jersey) {
        texture(Textures.jersey);
        ambientMaterial(185, 35, 35);
        specularMaterial(95, 95, 95);
        shininess(8);
        return true;
      }
      ambientMaterial(185, 35, 35);
      specularMaterial(95, 95, 95);
      shininess(8);
      return false;

    case "shorts":
      if (Textures.shorts) {
        texture(Textures.shorts);
        ambientMaterial(240, 240, 240);
        specularMaterial(85, 85, 85);
        shininess(6);
        return true;
      }
      ambientMaterial(240, 240, 240);
      specularMaterial(85, 85, 85);
      shininess(6);
      return false;

    case "sock":
      if (Textures.sock) {
        texture(Textures.sock);
        ambientMaterial(230, 230, 230);
        specularMaterial(70, 70, 70);
        shininess(5);
        return true;
      }
      ambientMaterial(230, 230, 230);
      specularMaterial(70, 70, 70);
      shininess(5);
      return false;

    case "boots":
      if (Textures.boots) {
        texture(Textures.boots);
        ambientMaterial(28, 28, 28);
        specularMaterial(180, 180, 180);
        shininess(26);
        return true;
      }
      ambientMaterial(28, 28, 28);
      specularMaterial(180, 180, 180);
      shininess(26);
      return false;

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
