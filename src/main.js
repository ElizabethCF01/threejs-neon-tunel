import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  TextureLoader,
  Color,
  FogExp2,
  Clock,
} from "three";

import Stats from "stats.js";
import radialBlurVertexShader from "./shaders/index.vert?raw";
import radialBlurFragmentShader from "./shaders/index.frag?raw";

import { AudioManager } from "./audio/audioManager.js";
import { PostProcessingManager } from "./effects/postProcessingManager.js";
import { TunnelGeometry } from "./geometry/tunnelGeometry.js";
import { SceneObjects } from "./objects/sceneObjects.js";
import { CameraController } from "./controls/cameraController.js";
import { initRadialBlurShader } from "./shaders/radialBlurShader.js";

import "./style.css";

let camera,
  scene,
  renderer,
  stats,
  clock,
  hue = 0;

// Managers and controllers
let audioManager;
let postProcessingManager;
let tunnelGeometry;
let sceneObjects;
let cameraController;

// Scene elements
let tubeLines;
let loadedTextures = [];

// TEXTURES
const textureLoader = new TextureLoader();

const imagePaths = [
  "textures/neon1.png",
  "textures/neon2.png",
  "textures/neon3.png",
  "textures/neon5.png",
  "textures/neon6.png",
];

async function preloadTextures() {
  const promises = imagePaths.map((path) => textureLoader.loadAsync(path));
  loadedTextures = await Promise.all(promises);
}

async function init() {
  await preloadTextures();

  // Initialize managers
  audioManager = new AudioManager();
  tunnelGeometry = new TunnelGeometry();
  sceneObjects = new SceneObjects();

  // RENDERER
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer = new WebGLRenderer({
    antialias: false, // Disabled for better performance, using FXAA instead
    powerPreference: "high-performance", // Request high-performance GPU
  });
  document.body.appendChild(renderer.domElement);

  // Setup audio
  await audioManager.init();

  const dpr = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height);

  // CAMERA
  const fov = 75;
  const aspect = width / height;
  const near = 0.1;
  const far = 1000;

  camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 15;

  // SCENE
  scene = new Scene();
  scene.background = new Color(0x000000);
  scene.fog = new FogExp2(0x000000, 0.3);

  // Initialize tunnel geometry
  const tunnel = tunnelGeometry.init();
  tubeLines = tunnel.tubeLines;
  scene.add(tubeLines);

  // Initialize scene objects
  const objects = sceneObjects.init(tunnel.curvePath, 0.5, loadedTextures);
  objects.movingObjects.forEach((obj) => scene.add(obj));
  objects.neonPlanes.forEach((plane) => scene.add(plane));
  scene.add(objects.particleSystem);

  // Initialize camera controller
  cameraController = new CameraController(camera, tunnel.curvePath);
  cameraController.init();

  // POSTPROCESSING
  postProcessingManager = new PostProcessingManager(renderer, scene, camera);
  const radialBlurShader = initRadialBlurShader(
    radialBlurVertexShader,
    radialBlurFragmentShader
  );
  postProcessingManager.init(radialBlurShader);

  // STATS
  stats = new Stats();
  document.body.appendChild(stats.dom);

  // EVENTS
  window.addEventListener("resize", onWindowResize);

  clock = new Clock();
  requestAnimationFrame(animate);
}

function animate() {
  stats.begin();
  const elapsed = clock.getElapsedTime();

  hue = (elapsed * 0.1) % 1;

  // Update camera and get speed info
  cameraController.update();
  const speedBoost = cameraController.getSpeedBoost();
  const lightness = 0.6 + speedBoost;

  // Update tube lines color
  if (tubeLines) {
    tubeLines.material.color.setHSL(hue, 1.0, lightness);
  }

  // Update object colors and animations
  sceneObjects.updateColors(hue, lightness);
  sceneObjects.animateMovingObjects();
  sceneObjects.animateNeonPlanes(camera);

  // Update post-processing effects
  postProcessingManager.updateBlurStrength(cameraController.getBlurStrength());

  // Audio-based effects
  if (audioManager.analyser) {
    const bassLevel = audioManager.getBassLevel();
    const midLevel = audioManager.getMidLevel();

    // RGB shift aberration effect
    const rgbAmount = 0.001 + (bassLevel > 0.1 ? bassLevel * 0.005 : 0);
    const rgbAngle = elapsed * 8;
    postProcessingManager.updateRGBShift(rgbAmount, rgbAngle);

    // Apply audio effects to scene objects
    sceneObjects.applyAudioEffects(midLevel);
  }

  postProcessingManager.render();
  stats.end();

  requestAnimationFrame(animate);
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  postProcessingManager.resize(width, height);
}

init();
